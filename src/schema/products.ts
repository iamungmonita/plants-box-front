import { FieldValues } from "react-hook-form";
import * as yup from "yup";

export interface Product extends FieldValues {
  description?: string;
  name: string;
  pictures: File[]; // Array of image URLs
  price: string; // Assuming price is a string; you can change it to a number if needed
  type: string;
  category: string;
  size: string; // e.g., "Small", "Medium", "Large"
  temperature?: string; // e.g., "60-75°F", "18-25°C"
  instruction?: string; // Detailed care instructions
  habit?: string; // Growth pattern, size, etc.
  stock: number; // Number of plants available in stock
}
export interface ProductAddPicture extends FieldValues {
  description?: string;
  name: string;
  pictures: string[]; // Array of image URLs
  price: string; // Assuming price is a string; you can change it to a number if needed
  type: string;
  size: string; // e.g., "Small", "Medium", "Large"
  temperature?: string; // e.g., "60-75°F", "18-25°C"
  instruction?: string; // Detailed care instructions
  habit?: string; // Growth pattern, size, etc.
  stock: number; // Number of plants available in stock
}

export interface ProductReturn {
  description?: string;
  name: string;
  pictures: File[]; // Array of image URLs
  price: string; // Assuming price is a string; you can change it to a number if needed
  type: string;
  category: string;
  size: string; // e.g., "Small", "Medium", "Large"
  temperature?: string; // e.g., "60-75°F", "18-25°C"
  instruction?: string; // Detailed care instructions
  habit?: string; // Growth pattern, size, etc.
  stock: number; // Number of plants available in stock
}

export interface ProductReturnList extends ProductReturn {
  __v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export const ProductSchema = yup.object().shape({
  name: yup.string().required("The plant name is required"),
  type: yup.string().required("Type is required"),
  category: yup.string().required("Category is required"),
  price: yup.string().required("Price is required"),
  description: yup.string().optional(),
  pictures: yup
    .mixed<File[]>() // This expects an array of File objects
    .required("At least one picture is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value || value.length === 0) return false; // No files were uploaded
      // Check if any file is not an image type
      for (let file of value) {
        if (!(file instanceof File) || !/^image\//.test(file.type)) {
          return false;
        }
      }
      return true; // All files are valid image types
    })
    .test("fileSize", "Each file must be less than 5MB", (value) => {
      if (!value || value.length === 0) return true; // Allow if no files are uploaded (to handle the "required" rule)
      // Check if any file exceeds 5MB
      for (let file of value) {
        if (file.size > 5000000) {
          return false;
        }
      }
      return true; // All files are below the size limit
    }),
  size: yup.string().required("size is required"),
  temperature: yup.string(),
  instruction: yup.string().optional(),
  habit: yup.string().optional(),
  stock: yup.number().required("stock is required"),
});
