import { PurchasedOrderList } from "@/models/Order";
import { Column } from "./Product";
import { formattedTimeStamp } from "@/helpers/format/time";

export const columns: Column<PurchasedOrderList>[] = [
  {
    id: "purchasedId",
    label: "Purchased ID",
    minWidth: 130,
  },

  {
    id: "totalDiscountPercentage",
    label: "Discount",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null ? `${value}%` : "0%",
  },
  {
    id: "totalPoints",
    label: "Points",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null ? `$${value.toFixed(2)}` : "$0.00",
  },
  {
    id: "totalAmount",
    label: "Total Amount",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null ? `$${value.toFixed(2)}` : "$0.00",
  },

  {
    id: "createdAt",
    label: "Purchased At",
    minWidth: 170,
    formatString: (value: string) => formattedTimeStamp(value, " HH:mm:ss a"),
  },
  {
    id: "createdBy",
    label: "Cashier",
    minWidth: 100,
  },
];
