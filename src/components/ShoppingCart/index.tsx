import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { useForm } from "react-hook-form";
import {
  addToCart,
  clearLocalStorage,
  handleDecrement,
  handleQuantityChange,
  removeItem,
  settlement,
  updateCartItems,
} from "@/helpers/addToCart";
import CartCard from "../CartCard";

export interface ShoppingCartProduct {
  _id: string;
  price: number;
  stock: number;
  quantity: number;
  picture: string[];
  name: string;
  size: string;
}

const ShoppingCart = ({ onClose }: { onClose: () => void }) => {
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setItems(updateCartItems().items);
    setTotal(updateCartItems().total);
    const handleCartUpdate = () => {
      setItems(updateCartItems().items);
      setTotal(updateCartItems().total);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleSettlement = (event: React.MouseEvent<HTMLButtonElement>) => {
    settlement(items);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Scrollable Items Container */}
      <div className="flex-grow max-h-[70vh] scroll-container space-y-4 pr-2">
        {items.length > 0 ? (
          items.map((item) => (
            <CartCard
              key={item._id}
              item={item}
              onDecrement={handleDecrement}
              onRemove={removeItem}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
