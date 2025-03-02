import React, { useEffect, useState } from "react";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { ShoppingCartProduct } from "../ShoppingCart";
import { addToCart, handleDecrement } from "@/helpers/addToCart";
import { useCartItems } from "@/hooks/useCartItems";
import Form from "../Form";
import { useForm, useFormContext } from "react-hook-form";

interface CartCardProps<ShoppingCartProduct> {
  item: ShoppingCartProduct;
  onDecrement: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onRetrieveDiscount?: (data: any) => void;
  renderExtraInfo?: (item: ShoppingCartProduct) => React.ReactNode; // Allows custom content
}

const CartCard = <T extends ShoppingCartProduct>({
  item,
  onDecrement,
  onRemove,
  onRetrieveDiscount,
}: CartCardProps<T>) => {
  const { items } = useCartItems();
  const [discountedValue, setDiscountedValue] = useState<number>(0);
  const sub = (price: string | number, qty: string | number) => {
    // Ensure both price and qty are numbers before multiplying
    return parseFloat(price.toString()) * parseFloat(qty.toString()) || 0;
  };
  const [inputValue, setInputValue] = useState<string>("");
  const onHandleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setInputValue(e.target.value);

    const existingItemIndex = items.findIndex((item) => item._id === id);
    if (existingItemIndex !== -1) {
      const total = sub(
        items[existingItemIndex].price,
        items[existingItemIndex].quantity
      );
      const discount = Number(e.target.value) / 100;
      const totalDiscountValue = discount * total;
      items[existingItemIndex].discount = totalDiscountValue.toString();
    }

    localStorage.setItem("plants", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <td className="py-2 flex mr-4 items-center justify-between">
        <button
          onClick={() =>
            handleDecrement(
              item._id,
              items[items.findIndex((index) => index._id === item._id)]
                ?.quantity
            )
          }
          className="text-xl px-2 border rounded"
        >
          -
        </button>
        <span> {item.quantity}</span>
        <button
          disabled={item.stock <= 0}
          onClick={() => addToCart(item._id, "plants")}
          className="text-xl px-2 border rounded"
        >
          +
        </button>
      </td>
      <td className="py-2">{item.name}</td>
      <td className="py-2">${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <input
          value={inputValue || item.discount}
          type="text"
          placeholder="%"
          onChange={(e) => onHandleDiscountChange(e, item._id)}
          className="p-2 w-16"
        />
      </td>

      <td className="py-2">${(item.price * item.quantity).toFixed(2)}</td>
      {/* <td className="py-2">
        <GoTrash />
      </td> */}
    </>
  );
};

export default CartCard;
