import React, { useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import {
  clearLocalStorage,
  handleDecrement,
  removeItem,
} from "@/helpers/addToCart";
import CartCard from "../CartCard";
import { useCartItems } from "@/hooks/useCartItems";

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
      <div className="flex-grow max-h-[35vh] scroll-container ">
        <table className="w-full text-left text-gray-700">
          {/* <thead>
            <tr className="grid grid-cols-6 gap-4 shadow-lg first-line:items-center">
              <th className="py-2">Qty</th>
              <th className="py-2 col-span-2 ml-4">Item</th>
              <th className="py-2">Price</th>
              <th className="py-2">Discount</th>
              <th className="py-2">Subtotal</th>
            </tr>
          </thead> */}
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="grid grid-cols-6 gap-4 px-2 border-b items-center"
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
