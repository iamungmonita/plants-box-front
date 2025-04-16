import React from "react";
import { useCartItems } from "@/hooks/useCartItems";
import { ShoppingCartProduct, CartCardProps } from "@/models/Cart";

const CustomerCard = <T extends ShoppingCartProduct>({
  item,
  idx,
}: CartCardProps<T>) => {
  const discountedValue =
    (item.price * item.quantity * Number(item.discount)) / 100;
  return (
    <>
      <td className="pt-2 pb-3">{idx ? idx + 1 : 1}</td>
      <td className="pt-2 pb-3 col-span-2">{item.name}</td>
      <td className="pt-2 pb-3 flex items-center justify-between">
        <span className="max-w-8 w-full min-w-8 text-center">
          {item.quantity}
        </span>
      </td>
      <td className="pt-2 pb-3">${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <input
          disabled={!item.isDiscountable}
          type="number"
          readOnly
          placeholder={item.isDiscountable ? `${item.discount || 0}%` : "None"}
          className={`p-2 w-16
            ${
              item.isDiscountable
                ? " hover:ring-2 hover:ring-gray-100"
                : "cursor-not-allowed opacity-60"
            }`}
        />
      </td>
      <td className="pt-2 pb-3 grid grid-cols-2 w-full min-w-[120px] items-center">
        ${(item.price * item.quantity - discountedValue).toFixed(2)}
      </td>
    </>
  );
};

export default CustomerCard;
