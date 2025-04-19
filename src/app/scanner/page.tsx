"use client";
import React, { useState } from "react";
import { addToCart } from "@/helpers/addToCart";
import useFetch from "@/hooks/useFetch";
import { getAllProducts } from "@/services/products";
import AlertPopUp from "@/components/AlertPopUp";
const CartPage: React.FC = () => {
  const [barcode, setBarcode] = useState<string>("");
  const { data: products } = useFetch(getAllProducts, {}, [barcode]);
  const [error, setError] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [toggleAlert, setToggleAlert] = useState<boolean>(false);

  const handleBarcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scannedBarcode = e.target.value;
    setBarcode(scannedBarcode);
    if (products) {
      const exist = products.find(
        (product) => product.barcode === scannedBarcode
      );
      if (exist && exist.stock <= 0) {
        setError(true);
        setAlertMessage("Please check available stock!");
        setToggleAlert(true);
      } else {
        addToCart(scannedBarcode, "plants");
      }
    }
  };

  return (
    <div>
      <AlertPopUp
        error={error}
        message={alertMessage}
        open={toggleAlert}
        onClose={() => setToggleAlert(false)}
      />
      <input
        type="text"
        value={barcode}
        onInput={handleBarcodeInput}
        placeholder="Scan barcode here"
        style={{ opacity: 0, position: "absolute", width: 0, height: 0 }}
      />
    </div>
  );
};

export default CartPage;
