import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import * as apiService from "./apiService/apiService";
import { Products, ProductDetail, Modal, Loading } from "./component";
// import { productDataAtLocal } from "./productDataAtLocal";
import { productDataAtLocal } from "./products";
import {
  getHeadersFromCookie,
  getProductData,
  deleteProductsSequentially,
  AddProductsSequentially,
} from "./utlis/utlis";

function App() {
  // const initRef = useRef(false);
  // const [detailLoading, setDetailLoading] = useState("");
  const AppModalRef = useRef(null);
  const [productData, setProductData] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const APIPath = import.meta.env.VITE_API_PATH;
  const [isLogginged, setIsLogginged] = useState(false);
  const changeInput = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };

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
        setIsLogginged(true);
        await getProductData(token, null, setProductData);
        // initRef.current = true;
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

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
  const handleAddProduct = async () => {
    const wrapData = {
      data: productDataAtLocal[productDataAtLocal.length - 1],
    };
    setTempProduct(null);
    try {
      const headers = getHeadersFromCookie();
      const resProduct = await apiService.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData,
        headers
      );
      alert(resProduct.data.success ? resProduct.data.message : "新增商品失敗");
      if (resProduct.data.success) {
        await getProductData(null, headers, setProductData);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

  const handleAddAllProducts = async () => {
    //測試Modal start
    AppModalRef.current.open();
    AppModalRef.current.setModalImage(null);
    AppModalRef.current.toggleFooter(false);
    //測試Modal end
    const headers = getHeadersFromCookie();

    const results = (await AddProductsSequentially(productDataAtLocal)) || [];
    await getProductData(null, headers, setProductData);
    setTempProduct(null);
    AppModalRef.current.close();
    if (results.length > 0) alert(results.join(","));
    // const results = [];
    // for (const [index, data] of productDataAtLocal.entries()) {
    //   // console.log(`index=${index}`);
    //   // console.log("headers=", headers);
    //   const wrapData = { data: data };
    //   try {
    //     await apiService.axiosPostAddProduct(
    //       `/api/${APIPath}/admin/product`,
    //       wrapData,
    //       headers
    //     );
    //     // results.push(result);
    //   } catch (error) {
    //     console.error(`Error adding product ${data.id}:`, error);
    //     results.push(`＄{data.id}產生錯誤`);
    //     // 或其他適當的錯誤處理方式
    //   }
    // }
    // try {
    //   const resProducts = await Promise.all(
    //     productDataAtLocal.map(async (data, index) => {
    //       const wrapData = { data: data };
    //       console.log(`index=${index}`);
    //       console.log("headers=", headers);
    //       return await apiService.axiosPostAddProduct(
    //         `/api/${APIPath}/admin/product`,
    //         wrapData,
    //         headers
    //       );
    //     })
    //   );
    //   // alert('所有產品都已成功上傳');
    //   // console.log('所有產品都已成功上傳：', resProducts);
    //   console.log("headers=", headers);
    //   await getProductData(null, headers, setProductData);
    //   setTempProduct(null);
    //   AppModalRef.current.close();
    // } catch (error) {
    //   console.error("上傳產品時發生錯誤：", error);
    //   if (error.request.response.message) alert(error.request.response.message);
    //   else alert(error.response.data.message);
    //   AppModalRef.current.close();
    // }
  };

  const handleLogout = async () => {
    try {
      const headers = getHeadersFromCookie();
      const res = await apiService.axiosPostLogout("/logout", headers);
      alert(res.data.success ? res.data.message : "登出失敗");
      if (res.data.success) {
        setIsLogginged(false);
        setProductData([]);
        setTempProduct(null);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  const handleDeleteAllProducts = async () => {
    const headers = getHeadersFromCookie();
    AppModalRef.current.open();
    AppModalRef.current.setModalImage(null);
    AppModalRef.current.toggleFooter(false);

    const results = (await deleteProductsSequentially(productData)) || [];
    await getProductData(null, headers, setProductData);
    setTempProduct(null);
    AppModalRef.current.close();
    if (results.length > 0) alert(results.join(","));
    // const results = [];
    // for (const [index, data] of productData.entries()) {
    //   // console.log(`index=${index}`);
    //   // console.log("headers=", headers);
    //   try {
    //     await apiService.axiosDeleteProduct(
    //       `/api/${APIPath}/admin/product/${data.id}`,
    //       headers
    //     );
    //     // results.push(result);
    //   } catch (error) {
    //     console.error(`Error deleting product ${data.id}:`, error);
    //     results.push(`＄{data.id}產生錯誤`);
    //     // 或其他適當的錯誤處理方式
    //   }
    // }
    // await getProductData(null, headers, setProductData);
    // setTempProduct(null);
    // AppModalRef.current.close();
    // if (results.length > 0) alert(results.join(","));
    // try {
    // const res = await Promise.all(
    //   productData.map(async (data, index) => {
    //     console.log(`index=${index}`);
    //     console.log("headers=", headers);
    //     return apiService.axiosDeleteProduct(
    //       `/api/${APIPath}/admin/product/${data.id}`,
    //       headers
    //     );
    //   })
    // );
    // } catch (error) {
    //   console.error("刪除產品時發生錯誤：", error);
    //   if (error.request.response.message) alert(error.request.response.message);
    //   else alert(error.response.data.message);
    //   AppModalRef.current.close();
    // }
    // alert('所有產品都已成功刪除');
    // console.log('所有產品都已成功刪除：', res);
  };

  const handleGetProducs = async () => {
    AppModalRef.current.open();
    AppModalRef.current.setModalImage(null);
    AppModalRef.current.toggleFooter(false);
    try {
      const headers = getHeadersFromCookie();
      await getProductData(null, headers, setProductData);
      // alert("已重新取得商品資料");
      setTempProduct(null);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
    AppModalRef.current.close();
  };

  const onGetProduct = useCallback(
    (productId) => {
      // console.log("productId=", productId);
      if (tempProduct?.id === productId) {
        // 當前選擇的產品與上一次相同，不進行任何操作
        // console.log("產品ID相同，不重複打開模態框");
        return;
      }
      const filterProduct =
        productData.filter((product) => product.id === productId)[0] || [];
      setTempProduct(filterProduct);
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
  const onDeleteProduct = useCallback(async (productId) => {
    // console.log("productId=", productId);
    AppModalRef.current.open();
    AppModalRef.current.setModalImage(null);
    AppModalRef.current.toggleFooter(false);
    const headers = getHeadersFromCookie();
    try {
      const res = await apiService.axiosDeleteProduct(
        `/api/${APIPath}/admin/product/${productId}`,
        headers
      );
      // console.log('產品已成功刪除：', res);
      await getProductData(null, headers, setProductData);
      setTempProduct(null);
      AppModalRef.current.close();
    } catch (error) {
      console.error("刪除產品時發生錯誤：", error);
      alert(error.response.data.message);
      AppModalRef.current.close();
    }
  }, []);
  // useEffect(() => {
  //   console.log("tempProduct");
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
      {isLogginged ? (
        <>
          <Modal
            ref={AppModalRef}
            modalBodyText="載入中"
            modalSize={{ width: "200px", height: "200px" }}
            modalImgSize={{ width: "200px", height: "120px" }}
          />
          <div className="row mt-5 mb-5 mx-3">
            <p className="text-secondary">Logginged</p>
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
                上傳內建資料最後一項產品
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
                onClick={handleGetProducs}
              >
                重新取得產品資料
              </button>
              <button
                type="button"
                className="btn btn-danger me-2"
                onClick={handleDeleteAllProducts}
              >
                刪除全部產品
              </button>
              <button
                type="button"
                className="btn btn-warning me-2"
                onClick={handleLogout}
              >
                登出
              </button>
            </div>
          </div>
          {productData.length > 0 ? (
            <div className="row mt-5 mb-5 mx-3">
              <div className="col-md-7 mb-3">
                <h2>產品列表</h2>
                <h1>產品總數:{productData.length}</h1>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>index</th>
                      <th style={{ width: "25%" }}>產品名稱</th>
                      <th>原價</th>
                      <th>售價</th>
                      <th>啟用</th>
                      <th style={{ width: "25%" }}>查看細節</th>
                      <th style={{ width: "25%" }}>刪除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.map((product, index) => {
                      return (
                        <Products
                          key={product.id}
                          {...product}
                          index={index}
                          onGetProduct={onGetProduct}
                          onDeleteProduct={onDeleteProduct}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col-md-4">
                <h2>單一產品細節</h2>
                {tempProduct ? (
                  <ProductDetail
                    title={tempProduct.title}
                    imageUrl={tempProduct.imageUrl}
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
