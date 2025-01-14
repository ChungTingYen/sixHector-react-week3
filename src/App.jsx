import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import * as apiService from "./apiService/apiService";
import {
  Products,
  ProductDetail,
  ProductDetailModal,
  ProductEditModal,
} from "./component";
// import { productDataAtLocal } from "./productDataAtLocal";
import { productDataAtLocal } from "./products";
import * as utils from "./utils/utils";
import { Modal } from "bootstrap";
function App() {
  const [productData, setProductData] = useState([]);
  //先給初始值，以免出現controll 跟 uncontroll的狀況
  const tempProductDefaultValue = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: 0,
    price: 0,
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  };
  const [tempProduct, setTempProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(tempProductDefaultValue);

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const APIPath = import.meta.env.VITE_API_PATH;
  const [isLoggin, setIsLoggin] = useState(false);

  const modalRef = useRef(null);
  const modalDivRef = useRef(null);
  const productDetailIdRef = useRef(null);
  //測試功能 start
  const AppModalRef = useRef(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [search, setSearch] = useState("");

  const [priceAscending, setPriceAscending] = useState(false);
  const [axiosConfig, setAxiosConfig] = useState({
    params: { page: 0 },
    headers: { Authorization: "" },
  });
  const [pages, setPages] = useState({
    currentPage: 0,
    totalPages: 0,
    category: "",
  });
  //測試功能 end

  const filterData = useMemo(() => {
    return [...productData]
      .filter((item) => item.title.match(search))
      .sort((a, b) => a.title.localeCompare(b.title))
      .sort((a, b) => priceAscending && a.price - b.price);
  }, [productData, search, priceAscending]);

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
      const headers = utils.getHeadersFromCookie();
      // const res = await apiService.axiosPostCheckSingin(
      //   "/api/user/check",
      //   headers
      // );
      //調用common.Authorization
      // const res = await axios.post("https://ec-course-api.hexschool.io" + "/api/user/check",{});
      const res = await apiService.axiosPostCheckSingin(
        "/api/user/check",
        headers
      );
      alert(res.data.success ? "已登入成功" : "請重新登入");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  const handleCheckLogin2 = async () => {
    try {
      const headers = utils.getHeadersFromCookie();
      const res = await apiService.axiosPostCheckSingin(
        "/api/user/check",
        headers
      );
      // alert(res.data.success ? "已登入成功" : "請重新登入");
      return res.data.success;
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
    AppModalRef.current.close();
  };
  //刪除當頁全部產品
  const handleDeleteAllProducts = async () => {
    modalStatus(AppModalRef, "刪除中", null, false);
    if (productData.length > 0) {
      const headers = utils.getHeadersFromCookie();
      const results =
        (await utils.deleteProductsSequentially(productData)) || [];
      await utils.getProductData(null, headers, setProductData);
      setTempProduct(null);
      if (results.length > 0) alert(results.join(","));
      AppModalRef.current.close();
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
      alert("error:" + error.response.data.message);
      console.log(error);
    }
  };
  //重新取得產品資料
  const handleGetProducts = async () => {
    modalStatus(AppModalRef, "載入中", null, false);
    setSelectedRowIndex("");
    try {
      const headers = utils.getHeadersFromCookie();
      const res =
        (await apiService.axiosGetProductData(
          `/api/${APIPath}/admin/products`,
          headers
        )) || [];
      console.log(res.data.pagination);
      setPages({
        currentPage: res.data.pagination.current_page,
        totalPages: res.data.pagination.total_pages,
        content: res.data.pagination.category,
      });
      await utils.getProductData(null, headers, setProductData);
      setTempProduct(null);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
    AppModalRef.current.close();
  };
  //下一頁資料
  const handleGetNextPageProducts = async () => {
    const headers = utils.getHeadersFromCookie();
    const updatedConfig = {
      ...axiosConfig,
      params: {
        ...axiosConfig.params,
        page: 2,
        category: "",
      },
      headers: headers, // 替換 headers
    };
    console.log("config=", updatedConfig);
    try {
      const res =
        (await apiService.axiosGetProductData2(
          `/api/${APIPath}/admin/products`,
          updatedConfig
        )) || [];
      setProductData(res.data.products);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const onGetProduct = useCallback(
    (productId) => {
      console.log("onGetProduct");
      productDetailIdRef.current = productId;
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
      const headers = utils.getHeadersFromCookie();
      try {
        modalStatus(AppModalRef, "刪除中", null, false);
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
      }
      AppModalRef.current.close();
    },
    [tempProduct]
  );
  const modalStatus = (AppModalRef, imgAlt, modalImg, toggleFooter) => {
    AppModalRef.current.setImgAlt(imgAlt);
    AppModalRef.current.setModalImage(modalImg);
    AppModalRef.current.toggleFooter(toggleFooter);
    AppModalRef.current.open();
  };
  // forwardRef AppModal
  useEffect(() => {
    if (AppModalRef.current) {
      // AppModalRef.current.close();
      console.log("useEffect AppModalRef.current.close();");
    }
  }, [productData]);
  // new Modal
  useEffect(() => {
    if (modalDivRef.current) {
      new Modal(modalDivRef.current, { backdrop: false });
    }
  }, []);
  useEffect(()=>{
    
    if(productDetailIdRef.current){
      console.log('productDetailIdRef=',productDetailIdRef.current);
      const temp = productData.find((item)=>item.id === productDetailIdRef.current);
      setTempProduct(temp);
      productDetailIdRef.current = null;
    }
  },[productDetailIdRef,productData]);
  //測試用Modal
  // useEffect(() => {
  //   if (detailLoading && Object.keys(tempProduct).length > 0) {
  //     const timeId = setTimeout(() => {
  //       AppModalRef.current.close();
  //     }, 3000);
  //     return () => clearTimeout(timeId);
  //   }
  // }, [detailLoading]);
  const [modalMode,setModalMode] = useState(null);
  const [tempImgsUrl,setTempImgsUrl] = useState('');
  const changePutProductData = (e,index = null) => {
    const { name, type, value, checked } = e.target;
    console.log('index=',index);
    let tempValue;
    if (type === "number") tempValue = Number(value);
    else if (type === "checkbox") tempValue = checked;
    else tempValue = value;
    const temp = {
      ...editProduct,
      [name]: tempValue,
    };
    // console.log("temp=", temp);
    setEditProduct(temp);
  };
  const handleEditModal = useCallback(
    (mode,productId = null) => {
      console.log("handleEditModal,mode,productId=", mode,productId);
      if (mode === "create") {
        setEditProduct(tempProductDefaultValue);
        setModalMode(mode);
      } else if (productId && mode === 'edit') {
        const { imagesUrl = [], ...rest } =
          productData.find((product) => product.id === productId) || {};
        const updatedProduct = {
          ...rest,
          imagesUrl: imagesUrl.filter(Boolean),
        };
        //imagesUrl.filter(Boolean) 是用來過濾掉 imagesUrl 數組中所有虛值的簡潔語法
        // （如 null、undefined、0、false、NaN 或空字符串）。
        setEditProduct(updatedProduct);
        setModalMode(mode);
      }
      openEditModal();
    },
    [productData]
  );
  const openEditModal = () => {
    console.log("openEditModal,mode=",modalMode);
    const modalInstance = Modal.getInstance(modalDivRef.current);
    modalInstance.show();
  };
  const closeEditModal = () => {
    setModalMode(null);
    console.log("closeEditModal=",modalMode);
    const modalInstance = Modal.getInstance(modalDivRef.current);
    modalInstance.hide();
  };
  const implementEditProduct = async (type,editProduct)=>{
    try {
      const headers = utils.getHeadersFromCookie();
  
      // const wrapData = { data: { ...editProduct,imagesUrl:[] } };
      const wrapData = { data:  editProduct };
      // console.log(editProduct);
      // console.log(wrapData);
      let path = '';
      let res = null;
      switch (type) {
      case 'create':
        path = `/api/${APIPath}/admin/product`;
        res = await apiService.axiosPostAddProduct(
          path,
          wrapData,
          headers
        );
        break;
      case 'edit':
        path = `/api/${APIPath}/admin/product/${editProduct.id}`;
        res = await apiService.axiosPutProduct(
          path,
          wrapData,
          headers
        );
        break;
      default:
        break;
      }
      if (res.data.success) {
        await utils.getProductData(null, headers, setProductData);
      }
      return (res.data.success ? res.data.message : "失敗");
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const handleEditProduct = async () => {
    console.log(editProduct.id);
    console.log('modalMode=',modalMode);
    modalStatus(AppModalRef, modalMode === 'create' ? '新增中' : '更新中', null, false);
    if (!editProduct.id && modalMode === 'edit') {
      alert("未取得product ID");
      AppModalRef.current.close();
      return;
    }
    try {
      const res = await implementEditProduct(modalMode,editProduct);
      alert(res);
    } catch (error) {
      alert('執行失敗' + error);
    }
    AppModalRef.current.close();
    closeEditModal();
   
  };
  const deleteImagesUrl = (imgUrlIndex)=>{
    const temp = editProduct.imagesUrl.filter((item,index)=>index != imgUrlIndex);
    setEditProduct((prev)=>({ ...prev,imagesUrl:temp }));
  };
  const addImagesUrl = ()=>{
    const temp = editProduct.imagesUrl.concat(tempImgsUrl);
    setEditProduct((prev)=>({ ...prev,imagesUrl:temp }));
    setTempImgsUrl('');
    // console.log(tempImgsUrl);
  };
  return (
    <>
      {/* <pre>{JSON.stringify(productData, null, 2)}</pre> */}
      {isLoggin ? (
        <>
          <div className="row mt-5 mb-3 mx-3">
            <div className="d-flex justify-content-between mb-3 ">
              <p className="text-secondary">Logging</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleEditModal("create")}
              >
                建立新的產品
              </button>
            </div>
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
                className="btn btn-secondary me-2"
                onClick={handleGetNextPageProducts}
              >
                下一頁
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
                搜尋名稱:
                <input
                  type="search"
                  style={{ width: "100px" }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="me-3">
                價格排序:
                <input
                  type="checkbox"
                  checked={priceAscending}
                  onChange={(e) => setPriceAscending(e.target.checked)}
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
                      <th style={{ width: "10%" }}>細節</th>
                      <th style={{ width: "10%" }}>刪除</th>
                      <th style={{ width: "20%" }}>功能</th>
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
                          handleEditModal={handleEditModal}
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

      {/* detail Modal */}
      <ProductDetailModal
        ref={AppModalRef}
        modalBodyText="訊息"
        modalSize={{ width: "200px", height: "200px" }}
        modalImgSize={{ width: "200px", height: "120px" }}
      />
      {/* edit Modal */}
      <>
        <div
          id="productModal"
          className="modal fade"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          ref={modalDivRef}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fs-4">
                  {editProduct.title}
                </h5>
                {/* X 按鈕 */}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeEditModal}
                  // data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="mb-4">
                      <label htmlFor="primary-image" className="form-label">
                        主圖
                      </label>
                      <div className="input-group">
                        <input
                          name="imageUrl"
                          type="text"
                          id="primary-image"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          value={editProduct.imageUrl}
                          onChange={changePutProductData}
                        />
                      </div>
                      <img
                        src={editProduct.imageUrl}
                        alt={editProduct.title}
                        className="img-fluid"
                      />
                    </div>

                    {/* 副圖 */}
                    <div className="border border-2 border-dashed rounded-3 p-3">
                      {editProduct.imagesUrl.map((image, index) => (
                        <div key={index} className="mb-2">
                          <label
                            htmlFor={`imagesUrl-${index + 1}`}
                            className="form-label"
                          >
                            副圖 {index + 1}
                          </label>
                          <input
                            id={`imagesUrl-${index + 1}`}
                            type="text"
                            placeholder={`圖片網址 ${index + 1}`}
                            className="form-control mb-2"
                            value={image}
                            onChange={(e)=>changePutProductData(e,index)}
                            name={`imagesUrl-${index + 1}`}
                          />
                          {image && (
                            <img
                              src={image}
                              alt={`副圖 ${index + 1}`}
                              className="img-fluid mb-2"
                            />
                          )}
                          { index > 0 && 
                            <button
                              type="button"
                              className="btn btn-danger w-100"
                              onClick={() => deleteImagesUrl(index)}
                            >
                              刪除
                            </button>
                          }
                          <hr/>
                        </div>
                        
                      ))}
                      {editProduct.imagesUrl.length < 5 ? (
                        <>
                          <input
                            type="text"
                            placeholder='圖片網址'
                            className="form-control mb-2"
                            value={tempImgsUrl}
                            onChange={(e)=>setTempImgsUrl(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={addImagesUrl}
                          >
                        新增副圖
                          </button></>) : <></>}
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        標題
                      </label>
                      <input
                        name="title"
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        value={editProduct.title}
                        onChange={changePutProductData}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={editProduct.category}
                        onChange={changePutProductData}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={editProduct.unit}
                        onChange={changePutProductData}
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          name="origin_price"
                          id="origin_price"
                          type="number"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={editProduct.origin_price}
                          onChange={changePutProductData}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          name="price"
                          id="price"
                          type="number"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={editProduct.price}
                          onChange={changePutProductData}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        產品描述
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        className="form-control"
                        rows={4}
                        placeholder="請輸入產品描述"
                        value={editProduct.description}
                        onChange={changePutProductData}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        說明內容
                      </label>
                      <textarea
                        name="content"
                        id="content"
                        className="form-control"
                        rows={4}
                        placeholder="請輸入說明內容"
                        value={editProduct.content}
                        onChange={changePutProductData}
                      ></textarea>
                    </div>

                    <div className="form-check">
                      <input
                        name="is_enabled"
                        type="checkbox"
                        className="form-check-input"
                        id="isEnabled"
                        checked={editProduct.is_enabled}
                        onChange={changePutProductData}
                      />
                      <label className="form-check-label" htmlFor="isEnabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label="Close"
                  onClick={closeEditModal}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditProduct}
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default App;
