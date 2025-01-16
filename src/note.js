
//以下紀錄舊寫法，連續post時高機率會出現驗證錯誤
const handleDeleteAllProducts = async (productData) => {
  const headers = getHeadersFromCookie();
  try {
    const res = await Promise.all(
      productData.map(async (data, index) => {
        console.log(`index=${index}`);
        console.log("headers=", headers);
        return apiService.axiosDeleteProduct(
          `/api/${APIPath}/admin/product/${data.id}`,
          headers
        );
      })
    );
    alert('所有產品都已成功刪除');
  } catch (error) {
    console.error("刪除產品時發生錯誤：", error);
    if (error.request.response.message) alert(error.request.response.message);
    else alert(error.response.data.message);
  }
};

const handleAddAllProducts = async (productDataAtLocal) => {
  const headers = getHeadersFromCookie();

  try {
    const resProducts = await Promise.all(
      productDataAtLocal.map(async (data, index) => {
        const wrapData = { data: data };
        console.log(`index=${index}`);
        console.log("headers=", headers);
        return await apiService.axiosPostAddProduct(
          `/api/${APIPath}/admin/product`,
          wrapData,
          headers
        );
      })
    );
    alert('所有產品都已成功上傳');
    console.log('所有產品都已成功上傳：', resProducts);
    await getProductData(null, headers, setProductData);
    setTempProduct(null);
  } catch (error) {
    console.error("上傳產品時發生錯誤：", error);
    if (error.request.response.message) alert(error.request.response.message);
    else alert(error.response.data.message);
  }
};

//助教寫法 start
const createProduct = async () => {
  try {
    // const headers = utils.getHeadersFromCookie();
    const wrapData = {
      data: {
        ...editProduct,
        is_enabled: editProduct.is_enabled ? 1 : 0,
        //price,original_price在取得輸入資料時handleEditDataChange已處理過
      },
    };
    let path = "";
    // const res = null;
    path = `/api/${APIPath}/admin/product`;
    const res = await apiService.axiosPostAddProduct(path, wrapData, headers);
    alert(res.data.success ? res.data.message : "create 失敗");
  } catch (error) {
    alert(error);
  }
};
const updateProduct = async () => {
  try {
    // const headers = utils.getHeadersFromCookie();
    const wrapData = {
      data: {
        ...editProduct,
        is_enabled: editProduct.is_enabled ? 1 : 0,
        //price,original_price在取得輸入資料時handleEditDataChange已處理過
      },
    };
    let path = "";
    path = `/api/${APIPath}/admin/product/${editProduct.id}`;
    const res = await apiService.axiosPostAddProduct(path, wrapData, headers);
    alert(res.data.success ? res.data.message : "create 失敗");
  } catch (error) {
    alert(error);
  }
};
  //助教寫法 end