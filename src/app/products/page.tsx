"use client";
import CardCarousel from "@/components/CardCarousel";
import StickyHeadTable from "@/components/Table";
import { Product, ProductReturn } from "@/schema/products";
import { getProductById } from "@/services/products";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";

const page = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [products, setProducts] = useState<ProductReturn[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4002/product/retrieve", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        setProducts(result.products);
        console.log(result.products);
      })
      .catch((err) => console.log(err));
  }, []);

  const addToCart = async (id: string) => {
    const productData = await getProductById(id);
    const newItem: ProductReturn = productData.product;
    const { _id, price, stock } = newItem;

    // Get existing items from localStorage
    const storedItems: {
      _id: string;
      price: string;
      stock: number;
      quantity: number;
    }[] = JSON.parse(localStorage.getItem("plants") || "[]");
    if (Array.isArray(storedItems)) {
      const existingItemIndex = storedItems.findIndex(
        (item) => item._id === id
      );
      if (existingItemIndex !== -1) {
        storedItems[existingItemIndex].price += price;
        storedItems[existingItemIndex].quantity += 1;
      } else {
        storedItems.push({ _id: _id, price, stock, quantity: 1 });
      }
    }

    // Update localStorage

    localStorage.setItem("plants", JSON.stringify(storedItems));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="">
      <div className="grid max-lg:grid-cols-2 max-xl:grid-cols-3 grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <Card
            key={product._id}
            sx={{
              minWidth: 300,
              padding: 2,
              boxShadow: "none",
              "&:hover": {
                transform: "scale(1.1)", // This will scale the card up by 5% when hovered
                transition: "transform 0.5s ease-in-out",
                // Smooth transition for scaling effect
              },
            }}
          >
            <div className="group p-2 relative transition-transform duration-500  ease-in-out">
              {/* Add 'group' class to the wrapper */}
              <CardMedia
                sx={{ minHeight: 250 }}
                image={`http://localhost:4002${product.pictures[0]}`}
                title={product.name}
              />
              <div className=" group-hover:bg-slate-100 flex items-center justify-between">
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    sx={{ fontFamily: "red hat display", fontWeight: 600 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontFamily: "red hat display",
                    }}
                  >
                    Price: ${product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontFamily: "red hat display",
                    }}
                  >
                    Stock: {product.stock}
                  </Typography>
                </CardContent>
                <div
                  onClick={() =>
                    alert(`added ${product.name} to the shopping cart.`)
                  }
                  className="hover:cursor-pointer"
                >
                  <TbShoppingBagPlus
                    onClick={() => addToCart(product._id)}
                    className="text-3xl max-md:text-2xl mr-2 text-green-800"
                  />
                </div>
              </div>
            </div>
          </Card>
          // <div key={product._id}>
          //   <p>{product._id}</p>
          //   <p>{product.name}</p>
          //   <p>{product.price}</p>
          //   {product.pictures.map((pic) => (
          //     <Image
          //       key={`http://localhost:4002${pic}` as string}
          //       src={`http://localhost:4002${pic}`}
          //       alt="img"
          //       width={100}
          //       height={100}
          //     />
          //   ))}
          // </div>
        ))}
      </div>
    </div>
  );
};

export default page;
