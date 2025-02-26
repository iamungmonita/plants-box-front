"use client";
import React, { useState } from "react";
import BarcodeGenerator from "@/components/BarCode";
const App = () => {
  const [productId, setProductId] = useState("67b9e13c5c8bb29b4b7dc2bb");

  // Function to handle barcode value change (for example when inputting a product ID)
  const handleBarcodeChange = (e) => {
    setProductId(e.target.value);
  };

  return (
    <div>
      <h1>Product Barcode</h1>
      <input
        type="text"
        value={productId}
        onChange={handleBarcodeChange}
        placeholder="Enter Product ID"
      />
      <BarcodeGenerator barcodeValue={productId} />
    </div>
  );
};

export default App;
