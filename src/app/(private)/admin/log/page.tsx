"use client";
import React from "react";
import ReusableTable from "@/components/Table";
import { ILogResponse, getLogs } from "@/services/log";
import useFetch from "@/hooks/useFetch";
import { columns } from "@/constants/TableHead/Log";

const Page = () => {
  const { data: log } = useFetch<ILogResponse[]>(getLogs, {}, []);

  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Daily Logs</h2>
      <ReusableTable columns={columns} data={log ?? []} />
    </div>
  );
};

export default Page;
