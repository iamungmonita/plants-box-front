import { PurchasedOrderList } from "@/models/Order";
import { Column } from "./Product";
import { formattedTimeStamp } from "@/helpers/format/time";
import { getOrderLabel, getPaymentLabel, OrderStatus } from "../Status";
import classNames from "classnames";

export const getStatusClass = (statusOrder: number) => {
  switch (statusOrder) {
    case OrderStatus.PENDING:
      return "text-yellow-600 bg-yellow-100 text-center rounded-lg";
    case OrderStatus.COMPLETE:
      return "text-green-600 bg-green-100 text-center rounded-lg";
    case OrderStatus.CANCELLED:
      return "text-red-600 bg-red-100 text-center rounded-lg";
    default:
      return "text-gray-600 bg-gray-100 text-center rounded-lg";
  }
};

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
    id: "orderStatus",
    label: "Order Status",
    minWidth: 100,
    render: (value: number) => {
      return (
        <div className={classNames(getStatusClass(value))}>
          {value !== undefined && value !== null ? getOrderLabel(value) : "-"}
        </div>
      );
    },
  },
  {
    id: "paymentStatus",
    label: "Payment Status",
    minWidth: 100,
    render: (value: number) => {
      return (
        <div className={classNames(getStatusClass(value))}>
          {value !== undefined && value !== null ? getPaymentLabel(value) : "-"}
        </div>
      );
    },
  },
  {
    id: "createdAt",
    label: "Purchased At",
    minWidth: 100,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
  {
    id: "createdBy",
    label: "Seller",
    minWidth: 100,
    formatString: (value: any) => [value?.firstName].join(" "),
  },
];
