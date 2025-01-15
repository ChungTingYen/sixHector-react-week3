
// import axios from 'axios';
import * as apiService from '../apiService/apiService';

const APIPath = import.meta.env.VITE_API_PATH;

export const getHeadersFromCookie = ()=>{
  const  token =  document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="))
    ?.split("=")[1];
  const headers = {
    Authorization: token,
  };
  return headers;
};

export const getProductData = async (headers,setProductData,pagesRef)=>{
  try {
    // axios.defaults.headers.common.Authorization = token;
    const resProduct = await apiService.axiosGetProductData(
      `/api/${APIPath}/admin/products`,
      headers
    ) || [];
    setProductData(resProduct.data.products);
    const { current_page, total_pages, category } = resProduct.data.pagination;
    const categoryValue = category || '';
    pagesRef.current = {
      current_page: current_page || 0,
      total_pages: total_pages || 0,
      category: categoryValue
    };
  } catch (error) {
    alert(error.response.data.message);
    console.log(error);
  }
};
// export const getProductData = async (token,headers,setProductData)=>{
//   if(token){
//     headers = {
//       Authorization: token,
//     };
//   }
//   try {
//     // axios.defaults.headers.common.Authorization = token;
//     const resProduct = await apiService.axiosGetProductData(
//       `/api/${APIPath}/admin/products`,
//       headers
//     ) || [];
//     setProductData(resProduct.data.products);
//   } catch (error) {
//     alert(error.response.data.message);
//     console.log(error);
//   }
// };

export async function deleteProductsSequentially(productData) { 
  const results = []; 
  const headers = getHeadersFromCookie();
  for (const [index, data] of productData.entries()) { 
    // console.log(`index=${index}`); 
    // console.log("headers=", headers); 
    try { 
      await apiService.axiosDeleteProduct( `/api/${APIPath}/admin/product/${data.id}`, 
        headers ); 
    } catch (error) { 
      console.error(`Error deleting product ${data.id}:`, error);
      const errorMessage = `Error adding product ${data.id}:`;
      results.push(errorMessage); 
      // 或其他適當的錯誤處理方式 
    } 
  } return results; 
}

export async function AddProductsSequentially(productData) { 
  const results = []; 
  const headers = getHeadersFromCookie();
  for (const [index, data] of productData.entries()) { 
    // console.log(`index=${index}`); 
    // console.log("headers=", headers); 
    const wrapData = { data: data };
    try { 
      await apiService.axiosPostAddProduct(
        `/api/${APIPath}/admin/product`,
        wrapData,
        headers
      );
    } catch (error) { 
      console.error(`Error adding product ${data.id}:`, error);
      const errorMessage = `Error adding product ${data.id}:`;
      results.push(errorMessage); 
      // 或其他適當的錯誤處理方式 
    } 
  } return results; 
}