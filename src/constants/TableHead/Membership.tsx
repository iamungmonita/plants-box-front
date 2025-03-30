import { formattedTimeStamp } from "@/helpers/format/time";
import { IMemberResponse } from "@/services/membership";
import { Column } from "./Product";

export const columns: Column<IMemberResponse>[] = [
  { id: "phoneNumber", label: "Phone Number", minWidth: 170 },
  { id: "type", label: "Membership Type", minWidth: 100 },
  {
    id: "isActive",
    label: "Active",
    minWidth: 100,
    formatBoolean: (value: boolean) => {
      return value ? (
        <div className="flex gap-2 justify-start items-center">
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "green",
              borderRadius: "100%",
            }}
          ></div>
          <p>Active</p>
        </div>
      ) : (
        <div className="flex gap-2 justify-start items-center">
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "red",
              borderRadius: "100%",
            }}
          ></div>
          <p>Inactive</p>
        </div>
      );
    },
  },
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
