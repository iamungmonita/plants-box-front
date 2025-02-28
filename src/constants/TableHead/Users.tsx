import { IRoleResponse } from "@/app/(private)/admin/settings/roles/create/page";
import {
  IAuthRegister,
  IAuthRegisterResponse,
} from "@/app/(private)/admin/settings/users/create/page";
import { formattedTimeStamp } from "@/helpers/format/time";
import API_URL from "@/lib/api";
import { ProductReturnList } from "@/schema/products";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}

export const columns: Column<IAuthRegisterResponse>[] = [
  {
    id: "_id", // Assuming "pictures" exists on ProductReturnList
    label: "Image",
    minWidth: 100,
  },
  { id: "firstname", label: "First Name", minWidth: 170 },
  { id: "lastname", label: "Last Name", minWidth: 100 },

  { id: "email", label: "email", minWidth: 170 },
  { id: "role", label: "role", minWidth: 170 },
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
];
