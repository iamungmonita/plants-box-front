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
import Checkbox from "@/components/Checkbox";
import CustomButton from "@/components/Button";
import AlertPopUp from "@/components/AlertPopUp";
import ImageUpload from "@/components/Upload";
import { Product } from "@/models/Product";
import useFetch from "@/hooks/useFetch";

export const CreateForm = ({ createId }: { createId: string }) => {
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
      remark: "",
    },
    resolver: yupResolver(ProductSchema),
  });
  const { setValue } = methods;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [, setLoading] = useState<boolean>(false);
  const [toggleAlert, setToggleAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { asObject: product, error: fetchError } = useFetch(
    getProductById,
    { params: { id: createId } },
    [createId]
  );
  useEffect(() => {
    if (!createId) return;
    if (product) {
      setValue("name", product.name);
      const selectedCategory = categories.find(
        (opt) => opt.value === product.category
      );
      if (selectedCategory) {
        setValue("category", selectedCategory.value ?? "");
      }
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("barcode", product.barcode);
      setValue("isActive", product.isActive);
      setValue("isDiscountable", product.isDiscountable);
      setValue("remark", product.remark);
      setValue("importedPrice", product.importedPrice);
      if (product.pictures) {
        setValue("pictures", product.pictures as unknown as string);
        setPreviewUrl(`${product.pictures as unknown as string}`);
      } else {
        setValue("pictures", "");
      }
    } else if (fetchError) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(fetchError);
    }
  }, [createId, product, fetchError]);

  const onSubmit = async (data: Product) => {
    try {
      const productData = {
        ...data,
        pictures: (previewUrl ?? null) as any,
      };
      const response = createId
        ? await updateProductDetailsById(createId, productData)
        : await AddNewProduct(productData);
      if (response.data) {
        setToggleAlert(true);
        setError(false);
        setAlertMessage("Success!");
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
        setValue("pictures", "");
        setValue("remark", "");
      }
    } catch (error: any) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(error.message);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("pictures", "");
    setPreviewUrl(null);
  };

  return (
    <Form
      methods={methods}
      className="grid grid-cols-2 gap-4 p-2"
      onSubmit={onSubmit}
    >
      <InputField name="name" type="text" label="Name" />
      <InputField name="barcode" type="text" label="Barcode" />
      <AutocompleteForm label="Category" name="category" options={categories} />
      <InputField name="stock" type="number" label="Stock" />
      <InputField name="importedPrice" type="number" label="Imported Price" />
      <InputField name="price" type="number" label="Price" />
      <Checkbox name="isActive" label="Active" />
      <Checkbox name="isDiscountable" label="Discountable" />
      <div className="col-span-2">
        <InputField
          name="remark"
          type="text"
          label="Remark"
          multiline
          minRows={3}
        />
      </div>

      <ImageUpload
        previewUrl={previewUrl}
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
          roleCodes={["1000", "1001"]}
          className="col-span-2"
          text={`${createId ? "Update" : "Create"}`}
        />
      </div>
    </Form>
  );
};
