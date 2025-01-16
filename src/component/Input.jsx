import React from "react";

const Input = (props)=>{
  const { name,type,id,className,placeholder,value,handleEditDataChange } = props;

  const xx = (e)=>{
    // console.log(e.target);
    handleEditDataChange(e);
  };
  
  return (
    <input
      name={name}
      type={type}
      id={id}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e)=>xx(e)}
    />
  );
};

export default Input;