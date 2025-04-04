import React, { useState } from "react";
import { addToCart, handleDecrement } from "@/helpers/addToCart";
import { useCartItems } from "@/hooks/useCartItems";
import { ShoppingCartProduct, CartCardProps } from "@/models/Cart";
import { MdClose } from "react-icons/md";

const CartCard = <T extends ShoppingCartProduct>({
  item,
  onRemove,
}: CartCardProps<T>) => {
  const { items } = useCartItems();
  const [inputValue, setInputValue] = useState<string>("");

  const onHandleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setInputValue(e.target.value);
    const existingItemIndex = items.findIndex((item) => item._id === id);
    if (existingItemIndex !== -1) {
      const discount = e.target.value;
      items[existingItemIndex].discount = discount;
    }
    localStorage.setItem("plants", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  const onHandleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id);
    }
  };
  return (
    <>
      <td className="pt-2 pb-3 flex items-center justify-between">
        <button
          onClick={() =>
            handleDecrement(
              item._id,
              items[items.findIndex((index) => index._id === item._id)]
                ?.quantity
            )
          }
          className="text-xl px-2 shadow-lg border rounded"
        >
          -
        </button>
        <span className="max-w-8 w-full min-w-8 text-center">
          {item.quantity}
        </span>
        <button
          disabled={item.stock <= 0}
          onClick={() => addToCart(item._id, "plants")}
          className="text-xl px-2 shadow-md border rounded"
        >
          +
        </button>
      </td>
      <td className="pt-2 pb-3 col-span-2 ml-6">{item.name}</td>
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
        <span>${(item.price * item.quantity).toFixed(2)}</span>
        <span className="text-end cursor-pointer">
          <MdClose onClick={() => onHandleRemove(item._id)} />
        </span>
      </td>
    </>
  );
};

export default CartCard;
