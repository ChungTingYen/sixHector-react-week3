import React, { useState, useEffect } from "react";

const LoadingDots = () => {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(
      () => setDots((prev) => (prev < 5 ? prev + 1 : 1)),
      500
    );

    return () => clearInterval(intervalId);
  }, []);

  return  <div className="row mt-5 mb-5">
    <h2 className="text-center">產品列表載入中{".".repeat(dots)}</h2>
  </div>;
};

export default LoadingDots;
