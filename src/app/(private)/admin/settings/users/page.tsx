"use client";

import ReusableTable from "@/components/Table";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Users";
import { getUsers, RetrieveRoles } from "@/services/system";
import CustomButton from "@/components/Button";
import { IAuthRegister, IAuthRegisterResponse } from "./create/page";

const page = () => {
  const [users, setUsers] = useState<IAuthRegisterResponse[]>([]);
  const methods = useForm();
  const { watch } = methods;
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data ?? []);
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
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="w-42">
          <CustomButton
            text="Create User"
            path="/admin/settings/users/create"
          />
        </div>
      </div>

      <div>
        <ReusableTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default page;
