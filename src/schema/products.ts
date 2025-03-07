import { FieldValues } from "react-hook-form";
import * as yup from "yup";
import { Response } from "./order";

export interface Product extends FieldValues {
  name: string;
  pictures?: string; // Array of image URLs
  price: number; // Assuming price is a string; you can change it to a number if needed
  category: string;
  stock: number; // Number of plants available in stock
  barcode: string;
  isActive: boolean;
  isDiscountable: boolean;
  importedPrice: number;
}

export interface ProductResponse extends Response {
  name: string;
  pictures?: File; // Array of image URLs
  price: number; // Assuming price is a string; you can change it to a number if needed
  importedPrice: number; // Assuming price is a string; you can change it to a number if needed
  category: string;
  isActive: boolean;
  isDiscountable: boolean;
  stock: number; // Number of plants available in stock
  barcode: string;
  discount?: number;
  stockUpdateCount?: number;
  updatedCount: ProductUpdateCount[];
  createdBy?: string;
  updatedBy?: string;
  soldQty: number;
}
export interface ProductUpdateCount {
  updateNumber: number;
  addedStock: number;
  oldStock: number;
  createdAt: string;
  updatedAt: string;
}

export const ProductSchema = yup.object().shape({
  name: yup.string().required("Plant name is required"),
  isActive: yup.boolean().default(true),
  isDiscountable: yup.boolean().default(true),
  barcode: yup.string().required("Barcode is required"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Price is required")
    .typeError("Price must be a valid number"),
  importedPrice: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Price is required")
    .typeError("Imported price must be a valid number"),
  pictures: yup.string().optional(), // Validate as string (base64)
  stock: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Stock is required")
    .typeError("Stock must be a valid number"),
});
