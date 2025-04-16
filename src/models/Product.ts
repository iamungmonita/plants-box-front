import { PurchasedOrderList } from "./Order";
import { FieldValues } from "react-hook-form";
import { Response } from "./Layout";

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
  remark?: string;
}

export interface ProductResponse extends Product, Response {
  discount?: number;
  convertedPoints?: number;
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
  updatedBy: string;
}

export interface IRange {
  total: number;
  amount: number;
  orders?: PurchasedOrderList[];
}

export interface IChart {
  id: string;
  value: number;
  label: string;
}
