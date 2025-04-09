"use client";

import ReusableTable from "@/components/Table";
import React, { useState, useEffect } from "react";
import { columns } from "@/constants/TableHead/Role";
import { getRoles } from "@/services/system";
import CustomButton from "@/components/Button";
import { IRoleResponse } from "@/models/Roles";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";

const Page = () => {
  const { data: roles } = useFetch(getRoles, {}, []);
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <div className="w-42">
          <CustomButton
            text="Create Role"
            roleCodes={["1007"]}
            path="/admin/settings/roles/create"
          />
        </div>
      </div>
      <div>
        <ReusableTable
          columns={columns}
          data={roles.filter((role) => role.isActive)}
          onRowClick={(row) => router.push(`/admin/settings/roles/${row._id}`)}
        />
      </div>
    </div>
  );
};

export default Page;
