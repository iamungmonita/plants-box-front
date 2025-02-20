import React from "react";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { ShoppingCartProduct } from "../ShoppingCart";
import { addToCart } from "@/helpers/addToCart";

interface CartCardProps<ShoppingCartProduct> {
  item: ShoppingCartProduct;
  onDecrement: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  renderExtraInfo?: (item: ShoppingCartProduct) => React.ReactNode; // Allows custom content
}

const CartCard = <T extends ShoppingCartProduct>({
  item,

  onDecrement,
  onRemove,
}: CartCardProps<T>) => {
  return (
    <div className="border shadow-md w-full rounded-lg py-2 px-4">
      <div className="flex items-center gap-4">
        <div className="relative w-[150px] h-[100px]">
          <Image
            title={item.name}
            src={item.picture[0]}
            alt={item.name as string}
            width={100}
            height={100}
            className="w-full h-full object-cover rounded p-1 border"
          />
        </div>
        <div className="w-full">
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <div className="flex justify-between w-full">
            <div>
              <p className="text-sm">{item.size}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-center gap-2 justify-between h-full">
              <div className="flex items-center gap-2 justify-end w-full">
                <button
                  onClick={() => onDecrement(item._id, item.quantity)}
                  className="text-xl px-2.5 border rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => addToCart(item._id, "plants")}
                  className="text-xl px-2.5 border rounded"
                >
                  +
                </button>
              </div>
              <p
                className={`${
                  item.quantity === item.stock
                    ? "text-red-500 opacity-100"
                    : "opacity-0"
                } text-sm duration-500 transition-transform`}
              >
                Only {item.quantity} left in stock
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 w-full">
        <h2 className="text-xl items-center flex gap-2 w-full">
          <span className="text-base text-gray-500">Total:</span> $
          {(item.price * item.quantity).toFixed(2)}
        </h2>
        <button
          className="text-gray-400 hover:text-red-500"
          onClick={() => onRemove(item._id)}
        >
          <GoTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
