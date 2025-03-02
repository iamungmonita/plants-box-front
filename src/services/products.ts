import { ProductAddPicture, ProductReturnList } from "@/schema/products";
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
}

export function getAllProducts(
  params: queryParam = {}
): Promise<ProductReturnList[]> {
  const queryString = query.stringify(params);
  const url = `${API_URL}/product/retrieve?${queryString}`;
  return GET<ProductReturnList[], {}>(url, {});
}

export function getProductById(id: string): Promise<ProductReturnList> {
  const url = `${API_URL}/product/` + id;
  return GET<ProductReturnList, {}>(url, {});
}

//POST
export function AddNewProduct(
  data: ProductAddPicture
): Promise<ILayout<ProductReturnList>> {
  const url = `${API_URL}/product/create`;
  return POST<ILayout<ProductReturnList>, ProductAddPicture>(url, data);
}

//PUT
export function updateProductStockById(
  id: string,
  params: any
): Promise<ProductReturnList> {
  const url = `${API_URL}/product/update/` + id;
  return POST<ProductReturnList, typeof params>(url, params);
}

export function updateProductDetailsById(
  id: string,
  params: ProductAddPicture
): Promise<ILayout<ProductReturnList>> {
  const url = `${API_URL}/product/update-details/` + id;
  return PUT<ILayout<ProductReturnList>, ProductAddPicture>(url, params);
}
