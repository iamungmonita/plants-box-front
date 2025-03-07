import { Product, ProductResponse } from "@/schema/products";
import API_URL from "@/lib/api";
import { GET, POST, PUT } from ".";
import query from "query-string";
import { ILayout } from "@/app/(private)/admin/settings/roles/create/page";

// GET
export interface queryParam {
  name?: string;
  category?: string;
  type?: string;
  purchasedId?: string;
  barcode?: string;
  date?: string;
  start?: string;
  end?: string;
  phoneNumber?: string;
}

export function getAllProducts(
  params: queryParam = {}
): Promise<ILayout<ProductResponse[]>> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/product/retrieve?${queryString}`;
  return GET<ILayout<ProductResponse[]>, {}>(url, {});
}
export function getBestSellingProducts(): Promise<ILayout<ProductResponse[]>> {
  const url = `${API_URL}/product/best-sellers`;
  return GET<ILayout<ProductResponse[]>, {}>(url, {});
}

export function getProductById(id: string): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/` + id;
  return GET<ILayout<ProductResponse>, {}>(url, {});
}

//POST
export function AddNewProduct(
  data: Product
): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/create`;
  return POST<ILayout<ProductResponse>, Product>(url, data);
}

//PUT
export function updateProductStockById(
  id: string,
  params: any
): Promise<ProductResponse> {
  const url = `${API_URL}/product/update/` + id;
  return POST<ProductResponse, typeof params>(url, params);
}

export function updateProductDetailsById(
  id: string,
  params: Product
): Promise<ILayout<ProductResponse>> {
  const url = `${API_URL}/product/update-details/` + id;
  return PUT<ILayout<ProductResponse>, Product>(url, params);
}
