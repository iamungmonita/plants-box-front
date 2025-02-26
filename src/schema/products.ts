import { FieldValues } from "react-hook-form";
import * as yup from "yup";

export interface Product extends FieldValues {
  name: string;
  pictures?: string; // Array of image URLs
  price: string; // Assuming price is a string; you can change it to a number if needed
  category: string;
  stock: number; // Number of plants available in stock
  barcode: string;
  isActive: boolean;
}
export interface ProductAddPicture extends FieldValues {
  name: string;
  pictures?: string; // Array of image URLs
  price: string; // Assuming price is a string; you can change it to a number if needed
  stock: number; // Number of plants available in stock
}

export interface ProductReturn {
  name: string;
  pictures?: File; // Array of image URLs
  price: string; // Assuming price is a string; you can change it to a number if needed
  category: string;
  isActive: boolean;
  stock: number; // Number of plants available in stock
  barcode: string;
}

export interface ProductReturnList extends ProductReturn {
  __v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export const ProductSchema = yup.object().shape({
  name: yup.string().required("The plant name is required"),
  isActive: yup.boolean().default(true),
  barcode: yup.string().required("The barcode is required"),
  category: yup.string().required("Category is required"),
  price: yup.string().required("Price is required"),
  pictures: yup.string().optional(), // Validate as string (base64)

  stock: yup.number().required("stock is required"),
});
