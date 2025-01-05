import { useEffect, useState, useCallback, useRef } from "react";

import * as apiService from "./apiService/apiService";
import { Products, ProductDetail, Modal } from "./component";

function App() {
  const [productData, setProductData] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  // const initRef = useRef(false);
  // const [detailLoading, setDetailLoading] = useState("");
  const [isLogginged, setIsLogginged] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log("account=", account);
    try {
      const res = await apiService.axiosPostSignin("/admin/signin", account);
      // console.log(res);
      alert(res.data.message);

      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      setIsLogginged(true);

      // console.log(document.cookie);
      // axios.defaults.headers.common.Authorization = token;
      // const resProduct = await axios.get(
      //   `${import.meta.env.VITE_BASE_URL}/v2/api/${
      //     import.meta.env.VITE_API_PATH
      //   }/admin/products/all`
      // );
      const headers = {
        Authorization: token,
      };
      const resProduct = await apiService.axiosGetProductData(
        `/api/${import.meta.env.VITE_API_PATH}/admin/products`,
        headers
      );
      // console.log(resProduct.data);
      setProductData(resProduct.data.products);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  const changeInput = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };
  const handleCheckLogin = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];

      console.log(token);

      const headers = {
        Authorization: token,
      };
      console.log(headers);
      const res = await apiService.axiosPostCheckSingin(
        "/api/user/check",
        headers
      );
      // axios.defaults.headers.common.Authorization = token;
      // const res = await axios.post(
      //   `${import.meta.env.VITE_BASE_URL}/v2/api/user/check`
      // );
      // console.log(res);
      alert(res.data.success ? "已登入成功" : "請重新登入");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };
  // const AppModalRef = useRef(null);
  const onGetProduct = useCallback(
    (productId) => {
      console.log("productId=", productId);
      if (tempProduct?.id === productId) {
        // 當前選擇的產品與上一次相同，不進行任何操作
        // console.log("產品ID相同，不重複打開模態框");
        return;
      }
      const filterProduct =
        productData.filter((product) => product.id === productId)[0] || [];
      setTempProduct(filterProduct);
      //測試用Modal
      // AppModalRef.current.open();
      // AppModalRef.current.setModalImage(null);
      // setDetailLoading(productId);
      // AppModalRef.current.toggleFooter(false);
      //這個方法也可以
      // AppModalRef.current.modalDivRef.current.querySelector(".modal-footer").style.display = 'none';
    },
    [tempProduct, productData]
  );
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
          {/* <Modal
            ref={AppModalRef}
            modalBodyText="商品細節載入中"
            modalSize={{ width: "200px", height: "200px" }}
            modalImgSize={{ width: "200px", height: "120px" }}
          /> */}
          <p className="text-secondary">Logginged</p>
          <button
            type="button"
            className="btn btn-warning"
            onClick={handleCheckLogin}
          >
            檢查登入狀態
          </button>
          <div className="row mt-5 mb-5 mx-3">
            <div className="col-md-6 mb-3">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product) => {
                    return (
                      <Products
                        key={product.id}
                        {...product}
                        onGetProduct={onGetProduct}
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
