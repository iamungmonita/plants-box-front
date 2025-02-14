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
import { options } from "@/constants/AutoComplete";

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

const Page: React.FC = () => {
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
  const searchParam = useParams();
  const createId = searchParam.id as string;
  useEffect(() => {
    if (!createId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(createId);
        const product = productData.product;
        console.log(product);
        setValue("name", product.name);
        const selectedOption = options.find((opt) => opt === product.type);
        if (selectedOption) {
          setValue("type", selectedOption);
        }
        setValue("price", product.price);
        setValue("description", product.description);
        setValue("size", product.size);
        setValue("temperature", product.temperature);
        setValue("instruction", product.instruction);
        setValue("habit", product.habit);
        setValue("stock", product.stock);
        setFileList(fileList);
        console.log(fileList);
        if (product.pictures) {
          setPreviewUrls(
            product.pictures.map((pic) => `http://localhost:4002${pic}`)
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-[600px] w-full">
        <h2 className="text-center text-lg font-extrabold uppercase">
          Create Product
        </h2>
        <Form
          methods={methods}
          className="grid grid-cols-2 gap-4 p-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputField name="name" type="text" label="Plant Name" />
          <InputField name="size" type="text" label="Plant Size" />
          <InputField
            name="temperature"
            type="text"
            label="Temperature Range"
          />
          <InputField name="instruction" type="text" label="Care Instruction" />
          <InputField name="habit" type="text" label="Growing Habit" />
          <InputField name="stock" type="number" label="Stock" />

          <AutocompleteForm label="Type" name="type" options={options} />
          <InputField name="price" type="text" label="Price" />
          <div className="col-span-2 w-full">
            <InputField
              name="description"
              type="text"
              label="Description"
              multiline
              minRows={3}
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
            type="submit"
            sx={{ backgroundColor: "var(--medium-light)" }}
          >
            {createId ? "Update Plant" : "Add Plant"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Page;
