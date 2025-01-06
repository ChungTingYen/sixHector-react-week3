
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

export const getProductData = async (token,headers,setProductData)=>{
  if(token){
    headers = {
      Authorization: token,
    };
  }
  try {
    // axios.defaults.headers.common.Authorization = token;
    const resProduct = await apiService.axiosGetProductData(
      `/api/${APIPath}/admin/products`,
      headers
    );
    setProductData(resProduct.data.products);
  } catch (error) {
    alert(error.response.data.message);
    console.log(error);
  }
};
