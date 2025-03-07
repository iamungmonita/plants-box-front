import React, { useState } from "react";
import { Button, Card } from "@mui/material";
import { TbShoppingBagPlus } from "react-icons/tb";
import API_URL from "@/lib/api";
import {
  addToCart,
  handleDecrement,
  updateCartItems,
} from "@/helpers/addToCart";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCartProduct } from "@/components/ShoppingCart";
import { ProductResponse } from "@/schema/products";

const AdminCard = ({ product }: { product: ProductResponse }) => {
  const [toggleWidth, setToggleWidth] = React.useState(false);

  const [items, setItems] = React.useState<ShoppingCartProduct[]>([]);
  const [total, setTotal] = React.useState(0);
  React.useEffect(() => {
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
  const routes = ["/products"];
  const pathname = usePathname();
  React.useEffect(() => {
    setToggleWidth(routes.some((route) => pathname.startsWith(route)));
  }, [pathname]);

  const handleAddToCart = (id: string) => {
    addToCart(id, "plants");
  };

  const onDecrement = (id: string) => {
    const match = items.findIndex((index) => index._id === id);
    if (!match) return;
    handleDecrement(id, items[match].quantity);
  };

  return (
    <Card
      key={product._id}
      className={`shadow-lg cursor-pointer relative min-w-[180px] h-[320px]
       flex flex-col hover:bg-gray-100 border duration-500 ease-in-out transition-all `}
    >
      <div className="relative w-full h-[60%]">
        <Image
          width={500}
          height={500}
          src={`${
            product.pictures
              ? `${API_URL}${product.pictures}`
              : "/assets/default.png"
          }`}
          alt={product.name}
          title={product.name}
          className="w-full h-full object-cover shadow rounded-t p-2"
        />
      </div>

      <div className="p-4 flex flex-col justify-between h-[40%]">
        <h2 className="text-xl max-md:text-lg font-semibold">{product.name}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="md:text-lg">
              ${parseFloat(product.price.toString()).toFixed(2)}
            </p>
            {product.stock === 0 ? (
              <p className="text-sm text-red-500">Out of Stock</p>
            ) : (
              <p className="text-sm flex gap-2">
                Stock: <span>{product.stock}</span>
              </p>
            )}
          </div>
          {/* {product.stock > 0 && (
            <div className="flex items-center gap-2 justify-end w-full">
              <button
                onClick={() =>
                  handleDecrement(
                    product._id,
                    items[items.findIndex((index) => index._id === product._id)]
                      ?.quantity
                  )
                }
                className="text-xl px-4 py-2 border rounded"
              >
                -
              </button>
              <span>
                {items[items.findIndex((index) => index._id === product._id)]
                  ?.quantity ?? 0}
              </span>
              <button
                disabled={product.stock <= 0}
                onClick={() => handleAddToCart(product._id)}
                className="text-xl px-4 py-2 border rounded"
              >
                +
              </button>
            </div>
          )} */}
          <button
            disabled={product.stock <= 0}
            onClick={() => handleAddToCart(product._id)}
            className="text-xl px-4 py-2 shadow-lg border rounded"
          >
            +
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AdminCard;
