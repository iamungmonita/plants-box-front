"use client";
import AutocompleteForm from "@/components/Autocomplete";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import ReusableTable from "@/components/Table";
import StickyHeadTable from "@/components/Table";
import { formattedTimeStamp } from "@/helpers/format-time";
import API_URL from "@/lib/api";
import { ProductReturn, ProductReturnList } from "@/schema/products";
import { getAllProducts } from "@/services/products";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Product";
import { categories, types } from "@/constants/AutoComplete";

const page = () => {
  const [products, setProducts] = useState<ProductReturnList[]>([]);
  const methods = useForm();
  const { watch } = methods;
  const product = watch("product");
  const type = watch("type");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProducts({
          name: product,
          type: type,
        });
        setProducts(response);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchProduct();
  }, [product, type]);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2>Products</h2>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "var(--medium-light)",
            padding: 1.5,
            width: 200,
            color: "white",
            border: "none",
          }}
        >
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <Form
        methods={methods}
        className="grid grid-cols-3 gap-4 w-1/2 max-md:w-full max-md:grid-cols-1"
      >
        <TextField
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
        />
        <AutocompleteForm label="Type" name="type" options={types} />
      </Form>
      <div>
        <ReusableTable
          columns={columns}
          data={products}
          onRowClick={(row) => router.push(`/admin/products/${row._id}`)}
        />
      </div>
    </div>
  );
};

export default page;
