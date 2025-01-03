import { adminInstance } from "./apiconfig";

export const  axiosGetProductData = async(path)=>{
  const response = await adminInstance.get(path);
  return response.data;
};