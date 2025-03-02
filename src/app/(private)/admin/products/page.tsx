"use client";
import AutocompleteForm from "@/components/Autocomplete";
import Form from "@/components/Form";
import ReusableTable from "@/components/Table";

import { ProductReturnList } from "@/schema/products";
import { getAllProducts } from "@/services/products";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Product";
import { categories } from "@/constants/AutoComplete";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputText";

const page = () => {
  const [products, setProducts] = useState<ProductReturnList[]>([]);
  const methods = useForm({
    defaultValues: {
      name: "",
      category: "",
    },
  });
  const { watch } = methods;
  const name = watch("name");
  const category = watch("category");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProducts({
          name,
          category,
        });
        setProducts(response);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchProduct();
  }, [name, category]);
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-xl">Products</h2>
        <div className=" w-52">
          <CustomButton path="/admin/products/create" text="Create Product" />
        </div>
      </div>
      <Form
        methods={methods}
        className="grid grid-cols-3 gap-4 w-1/2 max-md:w-full max-md:grid-cols-1"
      >
        <InputField label="Search Product Name" name="name" type="text" />

        <AutocompleteForm
          label="Category"
          name="category"
          options={categories.slice(1)}
        />
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
