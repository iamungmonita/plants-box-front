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
import { ArrowRight } from "@mui/icons-material";
import { useCartItems } from "@/hooks/useCartItems";
import Form from "../Form";

export interface ShoppingCartProduct {
  _id: string;
  price: number;
  stock: number;
  quantity: number;
  picture: string[];
  name: string;
  size: string;
}

const OrderPanel = ({ onClose }: { onClose?: () => void }) => {
  const { items } = useCartItems();
  const methods = useForm();
  const { watch, handleSubmit } = methods;

  const handleRemoveAll = () => {
    clearLocalStorage();
  };
  const getDiscountedValue = (data: any) => {
    console.log("from parent", data);
  };
  return (
    <div className="w-full">
      <div className="flex-grow max-h-[40vh] scroll-container space-y-2 py-2">
        <table className="w-full text-left text-gray-700">
          <thead>
            <tr className="grid grid-cols-6 gap-4 border-b items-center">
              <th className="py-2">Qty</th>
              <th className="py-2 col-span-2 ml-4">Item</th>
              <th className="py-2">Price</th>
              <th className="py-2">Discount</th>
              <th className="py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="grid grid-cols-6 gap-4 border-b items-center"
              >
                <CartCard
                  onRetrieveDiscount={getDiscountedValue}
                  key={item._id}
                  item={item}
                  onDecrement={handleDecrement}
                  onRemove={removeItem}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderPanel;
