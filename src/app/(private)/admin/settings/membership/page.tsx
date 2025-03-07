"use client";

import ReusableTable from "@/components/Table";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Membership";
import { RetrieveRoles } from "@/services/system";
import CustomButton from "@/components/Button";
import {
  IMemberResponse,
  IMembershipResponseList,
  retrieveMembership,
} from "@/services/membership";
import Form from "@/components/Form";
import InputField from "@/components/InputText";

const page = () => {
  const [membership, setMembership] = useState<IMemberResponse[]>([]);
  const methods = useForm({ defaultValues: { phoneNumber: "" } });
  const { watch } = methods;
  const phoneNumber = watch("phoneNumber");
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await retrieveMembership({ phoneNumber });
        if (response.data?.member) {
          setMembership(response.data.member);
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchMembership();
  }, [phoneNumber]);

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Membership</h2>

        <div className="w-42">
          <CustomButton
            text="Create Membership"
            path="/admin/settings/membership/create"
          />
        </div>
      </div>
      <Form methods={methods} className="w-1/4">
        <InputField name="phoneNumber" type="text" label="Phone Number" />
      </Form>
      <div>
        <ReusableTable columns={columns} data={membership} />
      </div>
    </div>
  );
};

export default page;
