"use client";

import ReusableTable from "@/components/Table";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Users";
import { getUsers, getRoles } from "@/services/system";
import CustomButton from "@/components/Button";
import { Profile } from "@/models/Auth";

const page = () => {
  const [users, setUsers] = useState<Profile[]>([]);
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

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="w-42">
          <CustomButton
            roleCodes={["1001"]}
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
