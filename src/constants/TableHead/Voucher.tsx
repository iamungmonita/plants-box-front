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
  { id: "barcode", label: "Barcode", minWidth: 170 },
  { id: "discount", label: "Discount", minWidth: 100 },

  {
    id: "validFrom",
    label: "Valid From",
    minWidth: 170,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
  {
    id: "validTo",
    label: "Valid To",
    minWidth: 170,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
  { id: "createdBy", label: "Created By", minWidth: 170 },

  {
    id: "isActive",
    label: "Active",
    minWidth: 170,
    formatBoolean: (value: boolean) => {
      return value ? <div>Active</div> : <div>Inactive</div>;
    },
  },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 170,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
];
