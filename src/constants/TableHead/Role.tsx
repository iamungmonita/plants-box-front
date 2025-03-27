import { formattedTimeStamp } from "@/helpers/format/time";
import { IRoleResponse } from "@/models/Roles";

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode;
}

export const columns: Column<IRoleResponse>[] = [
  { id: "name", label: "Name", minWidth: 170 },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 170,
    formatString: (value: any) => [value?.firstName].join(" "),
  },

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
