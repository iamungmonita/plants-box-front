"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
// @ts-ignore to bypass the TypeScript error (temporary solution)
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { getAllProducts } from "@/services/products";

import { addToCart } from "@/helpers/addToCart";
import { ProductResponse } from "@/models/Product";

// Define types for the product and cart
export interface Product {
  name: string;
  price: number;
  productId: string;
}

const CartPage: React.FC = () => {
  const [productId, setProductId] = useState<string>(""); // Store scanned barcode value
  const [cart, setCart] = useState<ProductResponse[]>([]); // Store cart items
  // const products = [{ name: "product 1", productId: "sku-00001", price: 2 }];
  const [products, setProducts] = useState<ProductResponse[]>([]);

  // Simulated product data for demonstration
  useEffect(() => {
    const fetch = async () => {
      const response = await getAllProducts();
      if (response.data) {
        setProducts(response.data);
      }
    };
    fetch();
  }, []);
  // Handle barcode scan result
  const handleBarcodeScan = (data: any) => {
    if (data) {
      setProductId(data.text); // Set scanned barcode value
    }
  };

  useEffect(() => {
    const product = products.find((product) => product.barcode === productId);
    if (product) {
      addToCart(product._id, "plants");
      alert(`${product.name} added to cart!`);
      setProductId(""); // Clear the barcode after adding
    } else {
      alert("Product not found!");
    }
  }, [productId]);
  return (
    <div>
      <h1>Scan a Barcode to Add Product to Cart</h1>

      {/* Barcode Scanner Component */}
      <BarcodeScannerComponent
        onUpdate={(err: any, result: any) => handleBarcodeScan(result)}
        facingMode="environment" // Use the rear camera
      />

      <div>
        <p>Scanned Product ID: {productId}</p>
        {/* {productId && (
          <Button onClick={handleAddToCart()} variant="contained">
            Add to Cart
          </Button>
        )} */}
      </div>

      <div>
        <h2>Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CartPage;
