import { formattedKHR } from "@/helpers/format/currency";
import { formattedTimeStamp } from "@/helpers/format/time";
import { ILogResponse } from "@/services/log";
import { Column } from "./Product";

const displayCurrency = (
  currencyObject: Record<string, string> | null | undefined
) => {
  if (!currencyObject) return; // Check if object is null or undefined

  return Object.entries(currencyObject).map(([key, value]) => {
    if (value === "0" || !value) return null;
    if (key.includes("R")) {
      const newKey = key.replace("R", "");
      return (
        <div key={key}>
          <span>
            {value} x {formattedKHR(Number(newKey))}៛
          </span>
        </div>
      );
    }
    return (
      <div key={key}>
        <span>
          {value} x {key}
        </span>
      </div>
    );
  });
};

export const columns: Column<ILogResponse>[] = [
  {
    id: "createdAt",
    label: "Logged At",
    minWidth: 170,
    formatString: (value: string) =>
      formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
  },
  {
    id: "dollars",
    label: "USD Bills",
    minWidth: 100,
    render: (_: any, row: any) => {
      return row.dollars ? displayCurrency(row.dollars) : <p></p>;
    },
  },
  {
    id: "riels",
    label: "KHR Bills",
    minWidth: 100,
    render: (_: any, row: any) => {
      return row.riels ? displayCurrency(row.riels) : <p></p>;
    },
  },

  {
    id: "dollarTotal",
    label: "Total USD",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null ? `$${value.toFixed(2)}` : "$0.00",
  },
  {
    id: "rielTotal",
    label: "Total KHR",
    minWidth: 100,
    format: (value: number) =>
      value !== undefined && value !== null
        ? `៛${formattedKHR(value)}`
        : "៛0,00",
  },
  {
    id: "createdBy",
    label: "Logged By",
    minWidth: 100,
    formatString: (value: any) => [value?.firstName].join(" "),
  },
];
