import React from "react";

import { handleDecrement, removeItem } from "@/helpers/addToCart";
import CartCard from "../CartCard";
import { useCartItems } from "@/hooks/useCartItems";

const OrderPanel = () => {
  const { items } = useCartItems();
  return (
    <div className="w-full">
      <div className="flex-grow max-h-[35vh] scroll-container ">
        <table className="w-full text-left text-gray-700">
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="grid grid-cols-6 gap-4 px-2 text-sm border-b items-center"
              >
                <CartCard
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
