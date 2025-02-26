import { formattedTimeStamp } from "@/helpers/format-time";
import API_URL from "@/lib/api";
import { ProductReturnList } from "@/schema/products";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}

export const columns: Column<ProductReturnList>[] = [
  {
    id: "pictures", // Assuming "pictures" exists on ProductReturnList
    label: "Image",
    minWidth: 100,
    render: (_: any, row: ProductReturnList) =>
      row.pictures ? (
        <img
          src={`${API_URL}${row.pictures}`}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ) : (
        <span>No Image</span>
      ),
  },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "type", label: "Type", minWidth: 100 },
  { id: "category", label: "Category", minWidth: 100 },
  {
    id: "price",
    label: "Price",
    minWidth: 170,
    align: "right",
    format: (value: number) => `$${value.toFixed(2)}`,
  },
  { id: "size", label: "Size", minWidth: 170 },
  { id: "stock", label: "Stock", minWidth: 170 },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 170,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
  {
    id: "updatedAt",
    label: "Updated At",
    minWidth: 170,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
];
