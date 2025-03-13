"use client";

import ReusableTable from "@/components/Table";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Role";
import { getRoles } from "@/services/system";
import CustomButton from "@/components/Button";
import { IRoleResponse } from "@/models/Roles";

const Page = () => {
  const [roles, setRoles] = useState<IRoleResponse[]>([]);
  const methods = useForm();
  const { watch } = methods;
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data ?? []);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchRoles();
  }, []);

  const deliveryMethod = watch("deliveryMethod");
  console.log(deliveryMethod);

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <div className="w-42">
          <CustomButton
            text="Create Role"
            path="/admin/settings/roles/create"
          />
        </div>
      </div>

      <div>
        <ReusableTable columns={columns} data={roles} />
      </div>
    </div>
  );
};

export default Page;
