import { formattedTimeStamp } from "@/helpers/format/time";
import { IMemberResponse } from "@/services/membership";
import { Column } from "./Product";

export const columns: Column<IMemberResponse>[] = [
  { id: "phoneNumber", label: "Phone Number", minWidth: 170 },
  { id: "type", label: "Membership Type", minWidth: 100 },
  { id: "points", label: "Points", minWidth: 100 },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 100,
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
];
