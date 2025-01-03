import { useEffect, useState } from 'react';
import  { adminInstance } from "./apiconfig";
import * as apiService from "./apiService/apiService";

function App() {
  const [productData,setProductData] = useState([]);
  useEffect(()=>{
    const getProductData = async()=>{
      const response = await apiService.axiosGetProductData('/products/all');
      const { products } = response;
      setProductData(products);
      console.log(response);
    };
    getProductData();
  },[]);
  return (
    <>
      <pre>{JSON.stringify(productData,null,2)}</pre>
      <p className="read-the-docs">
        week2
      </p>
    </>
  );
}

export default App;
