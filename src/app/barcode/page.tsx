"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
// @ts-ignore to bypass the TypeScript error (temporary solution)
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { getAllProducts } from "@/services/products";
import { ProductReturn, ProductReturnList } from "@/schema/products";

// Define types for the product and cart
export interface Product {
  name: string;
  price: number;
  productId: string;
}

const CartPage: React.FC = () => {
  const [productId, setProductId] = useState<string>(""); // Store scanned barcode value
  const [cart, setCart] = useState<Product[]>([]); // Store cart items
  const products = [{ name: "product 1", productId: "sku-00001", price: 2 }];

  // Simulated product data for demonstration

  // Handle barcode scan result
  const handleBarcodeScan = (data: any) => {
    if (data) {
      setProductId(data.text); // Set scanned barcode value
    }
  };

  // Add product to cart
  const addToCart = () => {
    // Find the product based on the scanned barcode value
    const product = products.find((product) => product.productId === productId);

    if (product) {
      setCart((prevCart) => [...prevCart, product]); // Add the product to the cart
      alert(`${product.name} added to cart!`);
      setProductId(""); // Clear the barcode after adding
    } else {
      alert("Product not found!");
    }
  };

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
        {productId && (
          <Button onClick={addToCart} variant="contained">
            Add to Cart
          </Button>
        )}
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
