"use client";
import StickyHeadTable from "@/components/Table";
import { Product, ProductReturn } from "@/schema/products";
import Button from "@mui/material/Button/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const page = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [products, setProducts] = useState<ProductReturn[]>([]);

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
  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2>Products</h2>
        <Button
          variant="contained"
          sx={{ backgroundColor: "var(--medium-light)" }}
        >
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
        {/* {products.length ? (
          <div>
            {products.map((product) => (
              <div key={product._id}>
                <p>{product._id}</p>
                <p>{product.name}</p>
                <p>{product.price}</p>
                <p>{product.createdAt}</p>
                <div>
                  {product.pictures.map((img) => (
                    <Image
                      key={img as string}
                      src={`http://localhost:4002${img}`}
                      alt={img as string}
                      width={200}
                      height={200}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )} */}
      </div>
      <div>
        <StickyHeadTable products={products} />
      </div>
    </div>
  );
};

export default page;
