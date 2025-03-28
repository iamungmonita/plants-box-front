"use client";

import ReusableTable from "@/components/Table";
import React from "react";
import { columns } from "@/constants/TableHead/Expense";
import { getAllExpenses } from "@/services/system";
import CustomButton from "@/components/Button";

import useFetch from "@/hooks/useFetch";

const Page = () => {
  const { data: expenses } = useFetch(getAllExpenses, {}, []);

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <div className="w-42">
          <CustomButton
            roleCodes={["1001"]}
            text="Create Expense"
            path="/admin/expense/create"
          />
        </div>
      </div>
      <div>
        <ReusableTable columns={columns} data={expenses} />
      </div>
    </div>
  );
};

export default Page;
