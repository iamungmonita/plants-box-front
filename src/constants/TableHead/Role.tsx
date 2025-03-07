import { IRoleResponse } from "@/app/(private)/admin/settings/roles/create/page";
import { formattedTimeStamp } from "@/helpers/format/time";
import API_URL from "@/lib/api";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}

export const columns: Column<IRoleResponse>[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "createdBy", label: "Created By", minWidth: 170 },

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
  { id: "remark", label: "Remarks", minWidth: 170 },
];
