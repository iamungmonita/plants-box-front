"use client";
import React from "react";
import ReusableTable from "@/components/Table";
import { ILogResponse, getLogs } from "@/services/log";
import useFetch from "@/hooks/useFetch";
import { columns } from "@/constants/TableHead/Log";

const page = () => {
  const { data: log } = useFetch<ILogResponse[]>(getLogs, {}, []);

  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Daily Logs</h2>
      {log.length > 0 ? (
        <ReusableTable columns={columns} data={log ?? []} />
      ) : (
        <p>No log has been recorded</p>
      )}
    </div>
  );
};

export default page;
