"use client";

import React, { useEffect, useState } from "react";
import Form from "@/components/Form";
import { FieldValues, useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { Product, ProductSchema } from "@/schema/products";
import AutocompleteForm from "@/components/Autocomplete";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useParams } from "next/navigation";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AddNewProduct,
  getProductById,
  updateProductDetailsById,
} from "@/services/products";
import { categories, types } from "@/constants/AutoComplete";
import API_URL from "@/lib/api";

const SortableImage = ({
  id,
  src,
  onRemove,
}: {
  id: string;
  src: string;
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative w-24 h-24 cursor-grab"
    >
      <img
        src={src}
        alt="Preview"
        className="w-full h-full object-cover rounded shadow-md"
      />
      <button
        onClick={onRemove}
        type="submit"
        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
      >
        ✖
      </button>
    </div>
  );
};
export const CreateForm = ({ createId }: { createId: string }) => {
  const methods = useForm<Product>({
    resolver: yupResolver(ProductSchema),
  });
  const { handleSubmit, setValue } = methods;
  const [fileList, setFileList] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = methods;

  const onSubmit = async (data: Product) => {
    const filePromises = fileList.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    const filesBase64 = await Promise.all(filePromises);
    const productData = { ...data, pictures: filesBase64 };
    try {
      const response = createId
        ? await updateProductDetailsById(createId, productData)
        : await AddNewProduct(productData);

      console.log("Upload result:", response);
      alert("Successfully created.");

      setValue("name", "");
      setValue("type", "");
      setValue("category", "");
      setValue("price", "");
      setValue("description", "");
      setValue("size", "");
      setValue("temperature", "");
      setValue("instruction", "");
      setValue("habit", "");
      setValue("stock", 0);
      setValue("pictures", []);
      setFileList([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setFileList((prev) => [...prev, ...files]);
      setPreviewUrls((prev) => [
        ...prev,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  useEffect(() => {
    if (!createId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(createId);
        const product = productData;
        setValue("name", product.name);
        const selectedType = types.find((opt) => opt === product.type);
        const selectedCategory = categories.find(
          (opt) => opt === product.category
        );
        if (selectedType || selectedCategory) {
          setValue("type", selectedType ?? "");
          setValue("category", selectedCategory ?? "");
        }
        setValue("price", product.price);
        setValue("description", product.description);
        setValue("size", product.size);
        setValue("temperature", product.temperature);
        setValue("instruction", product.instruction);
        setValue("habit", product.habit);
        setValue("stock", product.stock);

        console.log(product);
        if (product.pictures) {
          setPreviewUrls(
            product.pictures.map((pic: File) => `${API_URL}${pic.toString()}`)
          );
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [createId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = previewUrls.findIndex((url) => url === active.id);
      const newIndex = previewUrls.findIndex((url) => url === over.id);
      const newOrder = [...previewUrls];
      [newOrder[oldIndex], newOrder[newIndex]] = [
        newOrder[newIndex],
        newOrder[oldIndex],
      ];
      setPreviewUrls(newOrder);
      setFileList((prev) => {
        const newPicOrder = [...prev];
        [newPicOrder[oldIndex], newPicOrder[newIndex]] = [
          newPicOrder[newIndex],
          newPicOrder[oldIndex],
        ];
        return newPicOrder;
      });
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setFileList((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <Form
      methods={methods}
      className="grid grid-cols-2 gap-4 p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField name="name" type="text" label="Name" />
      <AutocompleteForm label="Category" name="category" options={categories} />

      <InputField name="size" type="text" label="Size" />
      <div className="grid grid-cols-2 gap-4">
        <InputField name="stock" type="number" label="Stock" />
        <InputField name="temperature" type="text" label="Temperature Range" />
      </div>
      <AutocompleteForm label="Type" name="type" options={types} />
      <InputField name="price" type="text" label="Price" />

      <div className="col-span-2 w-full space-y-4">
        <InputField
          name="habit"
          type="text"
          label="Growing Habit"
          multiline
          minRows={2}
        />
        <InputField
          name="description"
          type="text"
          label="Description"
          multiline
          minRows={2}
        />
        <InputField
          name="instruction"
          type="text"
          label="Care Instruction"
          multiline
          minRows={2}
        />

        <div className="flex flex-col gap-4 mt-4">
          <label
            htmlFor="pictures"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
          >
            Product Images
          </label>
          <input
            type="file"
            id="picture"
            multiple
            accept="image/*"
            {...register("pictures")}
            onChange={handleFileChange} // Handle file changes manually
          />
          <div>
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={previewUrls}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex gap-4 flex-wrap">
                  {previewUrls.map((src, index) => (
                    <SortableImage
                      key={src}
                      id={src}
                      src={src}
                      onRemove={() => removeImage(index)} // Pass event and index
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        className="col-span-2"
        type="submit"
        sx={{ backgroundColor: "var(--medium-light)", padding: 1 }}
      >
        {createId ? "Update Plant" : "Add Plant"}
      </Button>
    </Form>
  );
};
