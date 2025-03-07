import { formattedTimeStamp } from "@/helpers/format/time";
import {
  IMemberResponse,
  IMembershipResponseList,
} from "@/services/membership";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}

export const columns: Column<IMemberResponse>[] = [
  { id: "firstName", label: "First Name", minWidth: 170 },
  { id: "lastName", label: "Last Name", minWidth: 100 },

  { id: "phoneNumber", label: "Phone Number", minWidth: 170 },
  { id: "type", label: "Membership Type", minWidth: 100 },
  { id: "points", label: "Points", minWidth: 100 },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 100,
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
];
export const columnsPopUp: Column<IMemberResponse>[] = [
  { id: "firstName", label: "First Name", minWidth: 170 },
  { id: "lastName", label: "Last Name", minWidth: 100 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 170 },
  { id: "type", label: "Membership Type", minWidth: 170 },
];
