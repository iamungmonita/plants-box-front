"use client";

import React, { useEffect, useState } from "react";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductSchema } from "@/schema/products";
import { useAuthContext } from "@/context/AuthContext";
import AutocompleteForm from "@/components/Autocomplete";
import {
  AddNewProduct,
  getProductById,
  updateProductDetailsById,
} from "@/services/products";
import { categories } from "@/constants/AutoComplete";
import API_URL from "@/lib/api";
import Checkbox from "@/components/Checkbox";
import CustomButton from "@/components/Button";
import AlertPopUp from "@/components/AlertPopUp";
import { convertFileToBase64 } from "@/helpers/format/picture";
import ImageUpload from "@/components/Upload";
import { Product } from "@/models/Product";

export const CreateForm = ({ createId }: { createId: string }) => {
  const { profile } = useAuthContext();
  const [createdBy, setCreatedBy] = useState(profile?.firstName as string);
  const methods = useForm<Product>({
    defaultValues: {
      name: "",
      pictures: "",
      price: 0,
      category: "",
      isActive: true,
      isDiscountable: true,
      stock: 0,
      importedPrice: 0,
      barcode: "",
    },
    resolver: yupResolver(ProductSchema),
  });
  const { handleSubmit, setValue } = methods;
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [_, setLoading] = useState<boolean>(false);
  const [toggleAlert, setToggleAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const onSubmit = async (data: Product) => {
    try {
      let fileBase64 = ""; // Default to existing image
      if (file instanceof File) {
        fileBase64 = await convertFileToBase64(file);
      }

      const productData = {
        ...data,
        createdBy: createdBy,
        pictures: fileBase64 || data.pictures, // Ensure the correct image is sent
      };
      const response = createId
        ? await updateProductDetailsById(createId, productData)
        : await AddNewProduct(productData);

      if (response.data) {
        setToggleAlert(true);
        setError(false);
        setAlertMessage("Success!");
      } else {
        setToggleAlert(true);
        setError(true);
        setAlertMessage(`Error: ${response.message}`);
      }
      if (!createId) {
        setValue("name", "");
        setValue("category", "");
        setValue("price", 0);
        setValue("importedPrice", 0);
        setValue("barcode", "");
        setValue("stock", 0);
        setValue("isActive", true);
        setValue("isDiscountable", true);
        setValue("pictures", null as any);
        setFile(null);
        setPreviewUrl(null);
      } else if (fileBase64) {
        // If updating, update preview with new image
        setPreviewUrl(fileBase64);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("pictures", "");
    setFile(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    if (!createId) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(createId);
        if (productData.data) {
          setValue("name", productData.data?.name);
          const selectedCategory = categories.find(
            (opt) => opt.value === productData.data?.category
          );
          if (selectedCategory) {
            setValue("category", selectedCategory.value ?? "");
          }
          setValue("price", productData.data?.price);
          setValue("stock", productData.data?.stock);
          setValue("barcode", productData.data?.barcode);
          setValue("isActive", productData.data?.isActive);
          setValue("isDiscountable", productData.data?.isDiscountable);
          setValue("importedPrice", productData.data?.importedPrice);
          if (productData.data?.pictures) {
            setValue(
              "pictures",
              productData.data?.pictures as unknown as string
            );
            setPreviewUrl(
              `${API_URL}${productData.data?.pictures as unknown as string}`
            );
          } else {
            setValue("pictures", "");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [createId]);
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
      <InputField name="importedPrice" type="number" label="Imported Price" />
      <InputField name="price" type="number" label="Price" />
      <Checkbox name="isActive" label="Active" />
      <Checkbox name="isDiscountable" label="Discountable" />
      <ImageUpload
        previewUrl={previewUrl}
        setFile={setFile}
        setPreviewUrl={setPreviewUrl}
        handleRemoveImage={handleRemoveImage}
      />

      <AlertPopUp
        open={toggleAlert}
        message={alertMessage}
        error={error}
        onClose={() => setToggleAlert(false)}
      />

      <div className="col-span-2">
        <CustomButton
          type="submit"
          className="col-span-2"
          text={`${createId ? "Update" : "Create"}`}
        />
      </div>
    </Form>
  );
};
