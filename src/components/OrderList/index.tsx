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
  const [items, setItems] = useState<ShoppingCartProduct[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const { items, total } = updateCartItems(); // Call on mount
    setItems(items);
    setTotal(total);
    const handleCartUpdate = () => {
      const { items, total } = updateCartItems();
      setItems(items);
      setTotal(total);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  //   const handleSettlement = (event: React.MouseEvent<HTMLButtonElement>) => {
  //     settlement(items);
  //   };

  const handleRemoveAll = () => {
    clearLocalStorage();
  };

  return (
    <div className="w-full">
      {/* Scrollable Items Container */}
      <div className="flex-grow max-h-[40vh] scroll-container space-y-2 py-2">
        {/* <table className="w-full text-left text-gray-700 flex-grow max-h-[40vh] overflow-y-scroll space-y-4 pr-2">
          <thead>
            <tr className="border-b w-full">
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2 text-end">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2 text-end">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}

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
          <p className="text-center text-gray-500">No order has been made</p>
        )}
      </div>
    </div>
  );
};

export default OrderPanel;
