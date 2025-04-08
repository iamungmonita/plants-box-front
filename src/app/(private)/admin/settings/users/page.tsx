"use client";

import ReusableTable from "@/components/Table";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { columns } from "@/constants/TableHead/Users";
import { getUsers } from "@/services/system";
import CustomButton from "@/components/Button";
import { Profile } from "@/models/Auth";

const Page = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const router = useRouter();
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
    <div className="flex flex-col min-h-[90vh] justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="w-42">
          <CustomButton
            roleCodes={["1006"]}
            text="Create User"
            path="/admin/settings/users/create"
          />
        </div>
      </div>
      <div>
        <ReusableTable
          columns={columns}
          data={users.filter((user) => user.isActive)}
          onRowClick={(row) => router.push(`/admin/settings/users/${row._id}`)}
        />
      </div>
    </div>
  );
};

export default Page;
