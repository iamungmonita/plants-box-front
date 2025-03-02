"use client";

import React, { useEffect, useState } from "react";
import Form from "@/components/Form";
import { FieldValues, useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { Product, ProductSchema } from "@/schema/products";
import AutocompleteForm from "@/components/Autocomplete";
import {
  AddNewProduct,
  getProductById,
  updateProductDetailsById,
} from "@/services/products";
import { categories } from "@/constants/AutoComplete";
import API_URL from "@/lib/api";
import Checkbox from "@/components/Checkbox";
import { useAuthContext } from "@/context/AuthContext";
import CustomButton from "@/components/Button";

export const CreateForm = ({ createId }: { createId: string }) => {
  const methods = useForm<Product>({
    defaultValues: {
      name: "",
      pictures: "",
      price: "",
      category: "",
      isActive: true,
      stock: 0,
      barcode: "",
    },
    resolver: yupResolver(ProductSchema),
  });
  const { handleSubmit, setValue } = methods;
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = methods;
  const { isAuthorized } = useAuthContext();
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: Product) => {
    try {
      let fileBase64 = "";

      if (file instanceof File) {
        fileBase64 = await convertFileToBase64(file);
      }

      const productData = { ...data, pictures: fileBase64 };

      const response = createId
        ? await updateProductDetailsById(createId, productData)
        : await AddNewProduct(productData);
      if (response.success) {
        // toggleAlert(true);
      } else {
      }
      if (!createId) {
        setValue("name", "");
        setValue("category", "");
        setValue("price", "");
        setValue("barcode", "");
        setValue("stock", 0);
        setValue("isActive", false);
        setValue("pictures", null as any);
        setFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    if (!createId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(createId);
        const product = productData;
        setValue("name", product.name);
        const selectedCategory = categories.find(
          (opt) => opt === product.category
        );
        if (selectedCategory) {
          setValue("category", selectedCategory ?? "");
        }
        setValue("price", product.price);
        setValue("stock", product.stock);
        setValue("barcode", product.barcode);
        setValue("isActive", product.isActive);
        setValue("pictures", product.pictures as unknown as string);
        if (product.pictures) {
          setPreviewUrl(`${API_URL}${product.pictures as unknown as string}`);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [createId]);
  // if (!isAuthorized(["owner"])) {
  //   return <div>You do not have permission to view this page.</div>;
  // }

  return (
    <Form
      methods={methods}
      className="grid grid-cols-2 gap-4 p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField name="name" type="text" label="Name" />
      <InputField name="barcode" type="text" label="Barcode" />
      <AutocompleteForm label="Category" name="category" options={categories} />
      <InputField name="stock" type="number" label="Stock" />
      <InputField name="price" type="text" label="Price" />
      <Checkbox name="isActive" />

      <div className="col-span-2 w-full space-y-4">
        <div
          className="border-2 border-dashed p-4 flex justify-center items-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            {previewUrl ? (
              <div className="relative h-56">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-56 h-full object-cover rounded shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-green-800/70 text-white px-3 py-1"
                >
                  X
                </button>
              </div>
            ) : (
              "Drag and drop an image here, or click to select or replace"
            )}
          </label>
        </div>
      </div>

      <CustomButton
        type="submit"
        className="col-span-2"
        text={`${createId ? "Update Product" : "Create Product"}`}
      />
    </Form>
  );
};
function isAuthorized(arg0: string[]) {
  throw new Error("Function not implemented.");
}
