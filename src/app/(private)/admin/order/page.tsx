"use client";
import AutocompleteForm from "@/components/Autocomplete";
import ProductCard from "@/components/Card";
import AdminCard from "@/components/Card/Admin";
import CardCarousel from "@/components/CardCarousel";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import StickyHeadTable from "@/components/Table";
import { categories, types } from "@/constants/AutoComplete";
import { addToCart } from "@/helpers/addToCart";
import API_URL from "@/lib/api";
import { Product, ProductReturn, ProductReturnList } from "@/schema/products";
import { getAllProducts, getProductById } from "@/services/products";
import {
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TbShoppingBagPlus } from "react-icons/tb";

const ITEMS_PER_PAGE = 8; // Adjust this number based on how many items you want per page

const page = () => {
  const [products, setProducts] = useState<ProductReturnList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const methods = useForm();
  const name = methods.watch("name");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching products for category:", category); // Debugging

        const response = await getAllProducts({ category, name });
        if (response) {
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
  }, [category, name]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Get the products for the current page
  const currentItems = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  return (
    <div>
      <div className="flex  gap-4 w-full px-4">
        <Form methods={methods} className="w-1/2">
          <InputField
            label=""
            name="name"
            type="text"
            placeholder="Ex: Daisy"
          />
        </Form>
        <div className="w-full flex justify-between items-center">
          {categories.map((value, index) => (
            <Button
              key={index}
              variant="text"
              onClick={() => setCategory(value === "All Products" ? "" : value)}
              className="rounded-lg h-full"
              sx={{
                fontFamily: "var(--text)",
                backgroundColor:
                  category === value
                    ? "var(--medium-light)"
                    : category === ""
                    ? value === "All Products"
                      ? "var(--medium-light)"
                      : "gray"
                    : "gray",
                color: "white",
                border: "none",
              }}
            >
              <p className="capitalize px-4"> {value}</p>
            </Button>
          ))}
        </div>
      </div>
      {/* <TextField
          label="Product"
          {...methods.register("product")}
          {...methods.watch("product")}
          type="text"
          placeholder="Ex: Daisy"
        />
        <AutocompleteForm
          label="Category"
          name="category"
          options={categories}
        /> */}

      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4 gap-6">
        {currentItems.map((product) => (
          <AdminCard product={product} key={product._id} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default page;
