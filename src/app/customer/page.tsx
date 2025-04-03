"use client";
import { ShoppingCartProduct } from "@/models/Cart";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [cart, setCart] = useState<ShoppingCartProduct[]>([]);

  // Helper function to retrieve cart from localStorage
  const getCartFromStorage = useCallback(() => {
    const storedCart = localStorage.getItem("plants");
    return storedCart ? JSON.parse(storedCart) : [];
  }, []);

  useEffect(() => {
    // Initial cart load
    setCart(getCartFromStorage());

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "plants") {
        setCart(getCartFromStorage());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [getCartFromStorage]);

  return (
    <div>
      {cart.map((row, idx) => (
        <div key={idx}>
          {row.name} x {row.quantity}
        </div>
      ))}
    </div>
  );
};

export default Page;
