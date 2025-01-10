import { useEffect, useState, useCallback, useRef,useMemo } from "react";
import axios from "axios";
import * as apiService from "./apiService/apiService";
import { Products, ProductDetail, Modal } from "./component";
// import { productDataAtLocal } from "./productDataAtLocal";
import { productDataAtLocal } from "./products";
import * as utils from "./utils/utils";

function App() {
  const [productData, setProductData] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const APIPath = import.meta.env.VITE_API_PATH;
  const AppModalRef = useRef(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isLoggin, setIsLoggin] = useState(false);
  const [search,setSearch] = useState('');
  const [priceAscending,setPriceAscending] = useState(false);
  const [axiosConfig,setAxiosConfig] = useState({
    params: { page: '',content:'' }, 
    headers: { Authorization: '', },
  });
  const [pages,setPages] = useState({
    currentPage:0,
    totalPages:0
  });
  const filterData = useMemo(()=>{
    return [...productData]
      .filter((item)=>item.title.match(search))
      .sort((a,b)=>a.title.localeCompare(b.title))
      .sort((a,b)=>priceAscending && (a.price - b.price));
  },[productData,search,priceAscending]);

  const changeInput = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };
  //登入
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.axiosPostSignin("/admin/signin", account);
      alert(res.data.message);
      if (res.data.success) {
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        //執行axios.defaults.headers.common.Authorization
        axios.defaults.headers.common.Authorization = token;
        setIsLoggin(true);
        // const config = {};
        await utils.getProductData(token, null, setProductData);
        // initRef.current = true;
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  //檢查登入狀態
  const handleCheckLogin = async () => {
    try {
      // const headers = getHeadersFromCookie();
      // const res = await apiService.axiosPostCheckSingin(
      //   "/api/user/check",
      //   headers
      // );
      //調用common.Authorization
      // const res = await axios.post("https://ec-course-api.hexschool.io" + "/api/user/check",{});
      const res = await apiService.axiosPostCheckSingin2("/api/user/check");
      alert(res.data.success ? "已登入成功" : "請重新登入");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  //上傳內建資料隨機一項產品
  const handleAddProduct = async () => {
    const productIndex = parseInt(Date.now()) % productDataAtLocal.length;
    const wrapData = {
      data: productDataAtLocal[productIndex],
    };
    setTempProduct(null);
    try {
      const headers = utils.getHeadersFromCookie();
      const resProduct = await apiService.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData,
        headers
      );
      alert(resProduct.data.success ? resProduct.data.message : "新增商品失敗");
      if (resProduct.data.success) {
        await utils.getProductData(null, headers, setProductData);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  //上傳全部內建資料產品
  const handleAddAllProducts = async () => {
    modalStatus(AppModalRef, "上傳中", null, false);
    const headers = utils.getHeadersFromCookie();
    const results =
      (await utils.AddProductsSequentially(productDataAtLocal)) || [];
    await utils.getProductData(null, headers, setProductData);
    setTempProduct(null);
    if (results.length > 0) alert(results.join(","));
  };
  //刪除全部產品
  const handleDeleteAllProducts = async () => {
    modalStatus(AppModalRef, "刪除中", null, false);
    if (productData.length > 0) {
      const headers = utils.getHeadersFromCookie();
      const results =
        (await utils.deleteProductsSequentially(productData)) || [];
      await utils.getProductData(null, headers, setProductData);
      setTempProduct(null);
      if (results.length > 0) alert(results.join(","));
    }
  };
  // 登出
  const handleLogout = async () => {
    try {
      const headers = utils.getHeadersFromCookie();
      // console.log('handleLogout:',headers);
      const res = await apiService.axiosPostLogout("/logout", headers);
      alert(res.data.success ? res.data.message : "登出失敗");
      if (res.data.success) {
        setIsLoggin(false);
        setProductData([]);
        setTempProduct(null);
        setSelectedRowIndex(null);
      }
    } catch (error) {
      alert('error:' + error.response.data.message);
      console.log(error);
    }
  };
  //重新取得產品資料
  const handleGetProducts = async () => {
    modalStatus(AppModalRef, "載入中", null, false);
    setSelectedRowIndex("");
    try {
      const headers = utils.getHeadersFromCookie();
      await utils.getProductData(null, headers, setProductData);
      // alert("已重新取得商品資料");
      setTempProduct(null);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
      AppModalRef.current.close();
    }
  };

  const onGetProduct = useCallback(
    (productId) => {
      // console.log("productId=", productId);
      if (tempProduct?.id === productId) {
        // 當前選擇的產品與上一次相同，不進行任何操作
        console.log("產品ID相同，不重複打開模態框");
        return;
      }
      const filterProduct =
        productData.filter((product) => product.id === productId)[0] || [];
      setTempProduct(filterProduct);
      setSelectedRowIndex(filterProduct.id);
      //測試用Modal，點擊會出現Modal顯示載入中
      // AppModalRef.current.open();
      // AppModalRef.current.setModalImage(null);
      // setDetailLoading(productId);
      // AppModalRef.current.toggleFooter(false);
      //這個方法也可以
      // AppModalRef.current.modalDivRef.current.querySelector(".modal-footer").style.display = 'none';
    },
    [tempProduct, productData]
  );
  const onDeleteProduct = useCallback(
    async (productId) => {
      modalStatus(AppModalRef, "刪除中", null, false);
      const headers = utils.getHeadersFromCookie();
      try {
        const res = await apiService.axiosDeleteProduct(
          `/api/${APIPath}/admin/product/${productId}`,
          headers
        );
        await utils.getProductData(null, headers, setProductData);
        if (tempProduct?.id === productId) {
          setTempProduct(null);
        }
      } catch (error) {
        console.error("刪除產品時發生錯誤：", error);
        alert("刪除產品時發生錯誤：", error);
        AppModalRef.current.close();
      }
    },
    [tempProduct]
  );
  const modalStatus = (AppModalRef, imgAlt, modalImg, toggleFooter) => {
    AppModalRef.current.setImgAlt(imgAlt);
    AppModalRef.current.setModalImage(modalImg);
    AppModalRef.current.toggleFooter(toggleFooter);
    AppModalRef.current.open();
  };
  useEffect(() => {
    if (AppModalRef.current) {
      AppModalRef.current.close();
      console.log("useEffect AppModalRef.current.close();");
    }
    // console.log("tempProduct=", tempProduct?.id);
  }, [productData]);

  // });
  //測試用Modal
  // useEffect(() => {
  //   if (detailLoading && Object.keys(tempProduct).length > 0) {
  //     const timeId = setTimeout(() => {
  //       AppModalRef.current.close();
  //     }, 3000);
  //     return () => clearTimeout(timeId);
  //   }
  // }, [detailLoading]);

  return (
    <>
      {/* <pre>{JSON.stringify(productData, null, 2)}</pre> */}
      {isLoggin ? (
        <>
          <Modal
            ref={AppModalRef}
            modalBodyText="訊息"
            modalSize={{ width: "200px", height: "200px" }}
            modalImgSize={{ width: "200px", height: "120px" }}
          />
          <div className="row mt-5 mb-3 mx-3">
            <p className="text-secondary">Logging</p>
            <div className="d-flex">
              <button
                type="button"
                className="btn btn-warning me-2"
                onClick={handleCheckLogin}
              >
                檢查登入狀態
              </button>
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={handleAddProduct}
              >
                上傳內建資料隨機一項產品
              </button>
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={handleAddAllProducts}
              >
                上傳全部內建資料產品
              </button>
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleGetProducts}
              >
                重新取得產品資料
              </button>
              <button
                type="button"
                className="btn btn-danger me-2"
                onClick={handleDeleteAllProducts}
              >
                刪除本頁全部產品
              </button>
              <button
                type="button"
                className="btn btn-warning me-2"
                onClick={handleLogout}
              >
                登出
              </button>
            </div>
            <div className="d-flex align-items-center mt-3">
              <div className="me-3">
                      搜尋名稱:<input type="search" style={{ width: "100px" }} onChange={(e)=>{
                  setSearch(e.target.value);
                }}/>
              </div>
              <div className="me-3">
                      價格排序:
                <input type="checkbox" 
                  checked={priceAscending}
                  onChange={(e)=>setPriceAscending(e.target.checked)}
                />
                {priceAscending.toString()}
              </div>
            </div>
          </div>
          {productData.length > 0 ? (
            <div className="row mt-1 mb-1 mx-1">
              <div className="col-md-6 mb-3">
                <h2>產品列表,本頁產品數:{productData.length}</h2>
                {/* <p onClick={ShowNextPage}>第二頁</p> */}
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>index</th>
                      <th style={{ width: "25%" }}>產品名稱</th>
                      <th>原價</th>
                      <th>售價</th>
                      <th>啟用</th>
                      <th style={{ width: "25%" }}>查看細節</th>
                      <th style={{ width: "20%" }}>刪除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((product, index) => {
                      return (
                        <Products
                          key={product.id}
                          {...product}
                          index={index}
                          onGetProduct={onGetProduct}
                          onDeleteProduct={onDeleteProduct}
                          isSelected={product.id === selectedRowIndex}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <h2>單一產品細節</h2>
                {tempProduct ? (
                  <ProductDetail
                    title={tempProduct.title}
                    imageUrl={tempProduct.imageUrl}
                    setImgAlt={tempProduct.setImgAlt}
                    description={tempProduct.description}
                    content={tempProduct.content}
                    origin_price={tempProduct.origin_price}
                    price={tempProduct.price}
                    imagesUrl={tempProduct.imagesUrl}
                    category={tempProduct.category}
                  />
                ) : (
                  <p className="text-secondary">請選擇一個商品查看</p>
                )}
              </div>
            </div>
          ) : (
            <h1>沒有商品或商品載入中</h1>
          )}
        </>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                name="username"
                onChange={changeInput}
                value={account.username}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                name="password"
                onChange={changeInput}
                value={account.password}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary" type="submit">
              登入
            </button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
