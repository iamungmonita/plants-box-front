"use client";
import React, { useState } from "react";
import BarcodeGenerator from "@/components/BarcodeGenerator";
const Barcode = () => {
  const [productId, setProductId] = useState("sku-5501");

  const handleBarcodeChange = (e: any) => {
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

export default Barcode;
