import { adminInstance } from "./apiconfig";

export const  axiosGetProductData = async(path,config)=>{
  const response = await adminInstance.get(path, { headers: config });
  return response;
};

export const axiosPostSignin = async(path,account) =>{
  const response = await adminInstance.post(path, account);
  // return response.data;
  return response;
};

export const axiosPostCheckSingin = async(path,config) =>{
  const response = await adminInstance.post(path,{},{ headers: config });
  // return response.data;
  return response;
};