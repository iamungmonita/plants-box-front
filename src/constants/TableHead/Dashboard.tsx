import { PurchasedOrderList } from "@/models/Order";
import { Column } from "./Product";
import { formattedTimeStamp } from "@/helpers/format/time";
import { getOrderLabel, getPaymentLabel } from "../Status";
import classNames from "classnames";
import { getStatusClass } from "./Orders";

export const columns: Column<PurchasedOrderList>[] = [
  {
    id: "purchasedId",
    label: "Purchased ID",
    minWidth: 100,
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
    label: "Order",
    minWidth: 120,
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
    label: "Payment",
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
    formatString: (value: string) => formattedTimeStamp(value, " HH:mm:ss a"),
  },
  {
    id: "createdBy",
    label: "Seller",
    minWidth: 100,
    formatString: (value: any) => [value?.firstName].join(" "),
  },
];
