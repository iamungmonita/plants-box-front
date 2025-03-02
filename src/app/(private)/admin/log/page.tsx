"use client";
import ReusableTable from "@/components/Table";
import { Column } from "@/constants/TableHead/Product";
import { formattedKHR } from "@/helpers/format/currency";
import { formattedTimeStamp } from "@/helpers/format/time";
import { ILogResponse, RetrieveCount } from "@/services/log";
import React, { useEffect, useState } from "react";
import { ILayout } from "../settings/roles/create/page";

const page = () => {
  const [log, setLog] = useState<ILogResponse[]>([]);
  useEffect(() => {
    const fetchCount = async () => {
      const response = await RetrieveCount();
      if (response.data) {
        setLog(response.data);
      }
    };
    fetchCount();
  }, []);
  const displayCurrency = (
    currencyObject: Record<string, string> | null | undefined
  ) => {
    if (!currencyObject) return; // Check if object is null or undefined

    return Object.entries(currencyObject).map(([key, value]) => {
      if (value === "0" || !value) return null;
      if (key.includes("R")) {
        const newKey = key.replace("R", "");
        console.log(newKey);
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
  const columns: Column<ILogResponse>[] = [
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
      minWidth: 170,
      render: (_: any, row: any) => {
        return row.riels ? displayCurrency(row.riels) : <p></p>;
      },
    },
    {
      id: "createdBy",
      label: "Logged By",
      minWidth: 100,
    },
    {
      id: "createdAt",
      label: "Logged At",
      minWidth: 170,
      formatString: (value: string) =>
        formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
    },
  ];

  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Daily Logs</h2>
      {log.length > 0 ? (
        <ReusableTable columns={columns} data={log ?? []} />
      ) : (
        <div>No log has been recorded</div>
      )}
    </div>
  );
};

export default page;
