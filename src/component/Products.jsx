/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
// import Modal from "./Modal";
const Product = (props) => {
  const {
    index,
    id,
    title,
    origin_price,
    price,
    is_enabled,
    onGetProduct,
    onDeleteProduct,
  } = props;
  const atGetProduct = () => {
    onGetProduct(id);
  };
  const atDeleteProduct = () => {
    onDeleteProduct(id);
  };
  return (
    <>
      {
        <tr>
          <th scope="row">{index}</th>
          <th scope="row">{title}</th>
          {/* <td>{title}</td> */}
          <td>{origin_price}</td>
          <td>{price}</td>
          <td>{is_enabled ? "Y" : "N"}</td>
          <td>
            <button
              type="button"
              className="btn btn-primary"
              onClick={atGetProduct}
            >
              查看細節
            </button>
          </td>
          <td>
            <button
              type="button"
              className="btn btn-danger"
              onClick={atDeleteProduct}
            >
              刪除
            </button>
          </td>
        </tr>
      }
    </>
  );
};

export default Product;
