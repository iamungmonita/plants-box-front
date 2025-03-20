"use client";
import AutocompleteForm from "@/components/Autocomplete";
import Form from "@/components/Form";
import ReusableTable from "@/components/Table";
import { useAuthContext } from "@/context/AuthContext";
import { getAllProducts } from "@/services/products";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Product";
import { categories } from "@/constants/AutoComplete";
import CustomButton from "@/components/Button";
import InputField from "@/components/InputText";
import { ProductResponse } from "@/models/Product";

const Page = () => {
  const router = useRouter();
  const { profile } = useAuthContext();
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const methods = useForm({
    defaultValues: {
      name: undefined,
      category: undefined,
    },
  });
  const { watch, setValue } = methods;
  const name = watch("name");
  const category = watch("category");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProducts({
          search: name,
          category,
        });
        setProducts(response?.data ?? []);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchProduct();
  }, [name, category]);

  const onClear = () => {
    setValue("category", undefined);
    setValue("name", undefined);
  };

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-xl">Products</h2>
        <div className="w-52">
          <CustomButton path="/admin/products/create" text="Create Product" />
        </div>
      </div>
      <Form
        methods={methods}
        className="grid grid-cols-5 gap-4 w-1/2 max-md:w-full max-md:grid-cols-1"
      >
        <div className="col-span-4 grid grid-cols-2 gap-4">
          <InputField label="Search Product" name="name" type="text" />
          <AutocompleteForm
            label="Category"
            name="category"
            options={categories}
          />
        </div>
        <CustomButton text="Clear" theme="alarm" onHandleButton={onClear} />
      </Form>
      <div>
        <ReusableTable
          columns={columns}
          data={products.filter((product) => product.isActive)}
          onRowClick={(row) => router.push(`/admin/products/${row._id}`)}
        />
      </div>
    </div>
  );
};

export default Page;
