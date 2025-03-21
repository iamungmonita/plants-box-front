import { PurchasedOrderList } from "@/models/Order";
import { Column } from "./Product";
import { formattedTimeStamp } from "@/helpers/format/time";

export const columns: Column<PurchasedOrderList>[] = [
  {
    id: "purchasedId",
    label: "Purchased ID",
    minWidth: 100,
  },
  {
    id: "orders",
    label: "Sold Items",
    minWidth: 100,
    render: (_: any, row: PurchasedOrderList) => {
      return row.orders.length || "N/A";
    },
  },

  {
    id: "amount",
    label: "SubTotal",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null ? `$${value.toFixed(2)}` : "$0.00",
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
    id: "paymentMethod",
    label: "Payment Method",
    minWidth: 100,
  },
  {
    id: "createdAt",
    label: "Purchased At",
    minWidth: 170,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
  {
    id: "createdBy",
    label: "Seller",
    minWidth: 170,
  },
];
