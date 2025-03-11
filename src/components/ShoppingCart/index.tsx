import React, { useEffect, useRef, useState } from "react";

import {
  handleDecrement,
  removeItem,
  updateCartItems,
} from "@/helpers/addToCart";
import CartCard from "../CartCard";
import { ShoppingCartProduct } from "@/models/Cart";

const ShoppingCart = ({ onClose }: { onClose?: () => void }) => {
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Scrollable Items Container */}
      {/* <div className="flex-grow max-h-[70vh] scroll-container space-y-4 pr-2">
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
      </div> */}
    </div>
  );
};

export default ShoppingCart;
