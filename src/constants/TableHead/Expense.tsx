import { formattedTimeStamp } from "@/helpers/format/time";
import { Profile } from "@/models/Auth";
import { ExpenseResponse } from "@/models/Expensese";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}

export const columns: Column<ExpenseResponse>[] = [
  { id: "category", label: "Category", minWidth: 170 },
  {
    id: "amount",
    label: "Amount",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null ? `$${value.toFixed(2)}` : "$0.00",
  },
  { id: "supplier", label: "Supplier", minWidth: 170 },
  { id: "createdBy", label: "Created By", minWidth: 170 },
  {
    id: "date",
    label: "Expense Date",
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
