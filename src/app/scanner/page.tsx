"use client";
import React, { useState } from "react";
import { addToCart } from "@/helpers/addToCart";

const CartPage: React.FC = () => {
  const [barcode, setBarcode] = useState<string>("");

  const handleBarcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scannedBarcode = e.target.value;
    setBarcode(scannedBarcode);
    addToCart(scannedBarcode, "plants");
  };

  return (
    <div>
      <input
        type="text"
        value={barcode}
        onChange={handleBarcodeInput}
        placeholder="Scan barcode here"
        style={{ opacity: 0, position: "absolute", width: 0, height: 0 }}
      />
    </div>
  );
};

export default CartPage;
