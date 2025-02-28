"use client";
import ReusableTable from "@/components/Table";
import { Column } from "@/constants/TableHead/Product";
import { formattedTimeStamp } from "@/helpers/format/time";
import { getAllLogs, IUserLogResponse } from "@/services/log";
import React, { useEffect, useState } from "react";

const page = () => {
  const [logs, setLogs] = useState<IUserLogResponse[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const response = await getAllLogs();
      if (response) {
        setLogs(response);
      } else {
        console.log("error");
      }
    };
    fetch();
  }, []);
  const columns: Column<IUserLogResponse>[] = [
    {
      id: "username",
      label: "Username",
      minWidth: 170,
    },

    {
      id: "role",
      label: "Role",
      minWidth: 100,
    },
    {
      id: "createdAt",
      label: "Logged In At",
      minWidth: 170,
      formatString: (value: string) =>
        formattedTimeStamp(value, "YYYY MMM DD HH:mm:ss a"),
    },
  ];

  return (
    <div>
      {logs.length > 0 ? (
        <ReusableTable columns={columns} data={logs} />
      ) : (
        <div>No log has been recorded</div>
      )}
    </div>
  );
};

export default page;
