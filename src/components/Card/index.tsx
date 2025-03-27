import React from "react";
import Image from "next/image";
import { Card } from "@mui/material";
import { addToCart } from "@/helpers/addToCart";
import { ProductResponse } from "@/models/Product";

const POSCard = ({ product }: { product: ProductResponse }) => {
  return (
    <Card
      key={product._id}
      sx={{
        backgroundColor: product.stock === 0 ? "#f5f5f5" : "",
        borderColor: product.stock === 0 ? "red" : "",
      }}
      className={`shadow-lg border cursor-pointer relative min-w-[180px] h-[320px]
       flex flex-col hover:bg-gray-100 duration-500 ease-in-out transition-all`}
    >
      <div className="relative w-full h-[60%]">
        <Image
          width={500}
          height={500}
          src={`${product.pictures ? product.pictures : "/assets/default.png"}`}
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
          <button
            disabled={product.stock <= 0}
            onClick={() => addToCart(product._id, "plants")}
            className="text-xl px-4 py-2 shadow-lg border rounded"
          >
            +
          </button>
        </div>
      </div>
    </Card>
  );
};

export default POSCard;
