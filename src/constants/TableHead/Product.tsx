import { formattedTimeStamp } from "@/helpers/format/time";
import API_URL from "@/lib/api";
import { ProductResponse } from "@/models/Product";
import Image from "next/image";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  formatBoolean?: (value: boolean) => React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}

export const columns: Column<ProductResponse>[] = [
  {
    id: "pictures", // Assuming "pictures" exists on ProductReturnList
    label: "",
    minWidth: 100,
    render: (_: any, row: ProductResponse) =>
      row.pictures ? (
        <Image
          width={50}
          height={50}
          src={`${API_URL}${row.pictures}`}
          alt={`${API_URL}${row.pictures}`}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ) : (
        <Image
          width={50}
          height={50}
          src={`/assets/default.png`}
          alt={`/assets/plant.jpg`}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
  },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "category", label: "Category", minWidth: 100 },
  {
    id: "importedPrice",
    label: "Imported Price",
    minWidth: 100,

    format: (value: number) => `$${value ? value.toFixed(2) : (0).toFixed(2)}`,
  },
  {
    id: "price",
    label: "Price",
    minWidth: 100,

    format: (value: number) => `$${value.toFixed(2)}`,
  },
  { id: "stock", label: "Stock", minWidth: 100 },
  {
    id: "isActive",
    label: "Active",
    minWidth: 100,
    formatBoolean: (value: boolean) => {
      return value ? <div>Active</div> : <div>Inactive</div>;
    },
  },
  {
    id: "isDiscountable",
    label: "Discountable",
    minWidth: 100,
    formatBoolean: (value: boolean) => {
      return value ? <div>Discountable</div> : <div>Non-discountable</div>;
    },
  },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 100,
  },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 100,
    formatString: (value: string) => formattedTimeStamp(value, "YYYY MMM DD"),
  },
  {
    id: "updatedBy",
    label: "Updated By",
    minWidth: 100,
  },
  {
    id: "updatedAt",
    label: "Updated At",
    minWidth: 100,
    formatString: (value: string) => formattedTimeStamp(value, "YYYY MMM DD"),
  },
];
