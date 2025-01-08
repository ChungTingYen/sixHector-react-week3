
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