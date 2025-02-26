"use client";
import ReusableTable from "@/components/Table";
import { Column } from "@/constants/TableHead/Product";
import { formattedKHR } from "@/helpers/format-currency";
import { ILogResponse, LogData, RetrieveCount } from "@/services/log";
import React, { useEffect, useState } from "react";

const page = () => {
  const [log, setLog] = useState<LogData[]>([]);
  useEffect(() => {
    const fetchCount = async () => {
      const response = await RetrieveCount();
      setLog(response);
    };
    fetchCount();
  }, []);
  const displayCurrency = (
    currencyObject: Record<string, string> | null | undefined
  ) => {
    if (!currencyObject) return <p>0</p>; // Check if object is null or undefined

    return Object.entries(currencyObject).map(([key, value]) => {
      if (value === "0") return null;
      return (
        <div key={key}>
          <span>{key}: </span>
          <span>{value}</span>
        </div>
      );
    });
  };
  const columns: Column<LogData>[] = [
    {
      id: "counter",
      label: "Counter",
      minWidth: 100,
    },

    {
      id: "usd",
      label: "USD",
      minWidth: 100,
    },
    {
      id: "khr",
      label: "KHR",
      minWidth: 170,
    },

    {
      id: "dollars",
      label: "Currency Breakdown",
      minWidth: 100,
      render: (_: any, row: any) => {
        return row.dollars ? (
          displayCurrency(row.dollars)
        ) : (
          <p>No currency data</p>
        );
      },
    },
    {
      id: "riels",
      label: "KHR Bills",
      minWidth: 170,
    },
  ];

  return (
    <div>
      {log.length > 0 ? (
        <ReusableTable columns={columns} data={log} />
      ) : (
        <div>No orders have been recorded for this product.</div>
      )}
      {/* {log.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Counter</th>
              <th>USD</th>
              <th>KHR</th>
              <th>USD Bills</th>
              <th>KHR Bills</th>
            </tr>
          </thead>
          <tbody>
            {log.map((row, index) => (
              <tr key={index}>
                <td>{row.counter}</td>
                <td>{row.khr as unknown as number}</td>
                <td>{row.usd as unknown as number}</td>
                <td>{displayCurrency(row.dollars as unknown as any)}</td>
                <td>{displayCurrency(row.riels as unknown as any)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}
    </div>
  );
};

export default page;
