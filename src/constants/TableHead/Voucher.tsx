import { formattedTimeStamp } from "@/helpers/format/time";

import { VoucherResponse } from "@/models/Voucher";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  formatBoolean?: (value: boolean) => React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}
export const columns: Column<VoucherResponse>[] = [
  { id: "name", label: "Name", minWidth: 100 },
  { id: "barcode", label: "Barcode", minWidth: 100 },
  {
    id: "discount",
    label: "Discount",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null ? `${value}%` : "0%",
  },

  {
    id: "validFrom",
    label: "Valid From",
    minWidth: 100,
    formatString: (value: string) => formattedTimeStamp(value, "YYYY MMM DD"),
  },
  {
    id: "validTo",
    label: "Valid To",
    minWidth: 100,
    formatString: (value: string) => formattedTimeStamp(value, "YYYY MMM DD"),
  },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 100,
    formatString: (value: any) =>
      value ? [value?.firstName].join(" ") : "N/A",
  },
  {
    id: "isExpired",
    label: "Expired",
    minWidth: 100,
    formatBoolean: (value: boolean) => {
      return value ? (
        <div className="flex gap-2 justify-start items-center">
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "red",
              borderRadius: "100%",
            }}
          ></div>
          <p>Expired</p>
        </div>
      ) : (
        <div className="flex gap-2 justify-start items-center">
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "green",
              borderRadius: "100%",
            }}
          ></div>
          <p>Valid</p>
        </div>
      );
    },
  },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 100,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
];
