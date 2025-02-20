"use client";
import ProductCard from "@/components/Card";
import CardCarousel from "@/components/CardCarousel";
import StickyHeadTable from "@/components/Table";
import { addToCart } from "@/helpers/addToCart";
import API_URL from "@/lib/api";
import { Product, ProductReturn, ProductReturnList } from "@/schema/products";
import { getAllProducts, getProductById } from "@/services/products";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";

const page = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [products, setProducts] = useState<ProductReturnList[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProducts();
        if (response && response) {
          setProducts(response); // Set state if products exist
        } else {
          console.error("No products found in response");
          setProducts([]); // Ensure state is set even if response is incorrect
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4 gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default page;
