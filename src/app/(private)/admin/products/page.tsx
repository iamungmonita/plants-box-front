"use client";
import StickyHeadTable from "@/components/Table";
import { ProductReturn, ProductReturnList } from "@/schema/products";
import { getAllProducts } from "@/services/products";
import Button from "@mui/material/Button/Button";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const page = () => {
  const [products, setProducts] = useState<ProductReturnList[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProducts();
        console.log(response);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchProduct();
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
      </div>
      <div>
        <StickyHeadTable products={products} />
      </div>
    </div>
  );
};

export default page;
