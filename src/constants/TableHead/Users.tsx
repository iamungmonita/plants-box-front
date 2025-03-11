import { formattedTimeStamp } from "@/helpers/format/time";
import API_URL from "@/lib/api";
import { Profile } from "@/schema/auth";

export interface Column<T> {
  id: keyof T; // id should be a key of T, which is ProductReturnList in this case
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode; // Render method for custom columns like image
}

export const columns: Column<Profile>[] = [
  {
    id: "pictures", // Assuming "pictures" exists on ProductReturnList
    label: "",
    minWidth: 100,
    render: (_: any, row: Profile) =>
      row.pictures ? (
        <img
          src={`${API_URL}${row.pictures}`}
          alt={`${API_URL}${row.pictures}`}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: "100%",
          }}
        />
      ) : (
        <img
          src={`/assets/default-profile.jpg`}
          alt={`/assets/default-profile.jpg`}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: "100%",
          }}
        />
      ),
  },
  { id: "firstName", label: "First Name", minWidth: 170 },
  { id: "lastName", label: "Last Name", minWidth: 100 },

  { id: "phoneNumber", label: "Phone Number", minWidth: 170 },
  { id: "role", label: "Role", minWidth: 170 },
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
];
