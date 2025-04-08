"use client";

import ReusableTable from "@/components/Table";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Membership";
import CustomButton from "@/components/Button";
import { IMemberResponse, getAllMembership } from "@/services/membership";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import AutocompleteForm from "@/components/Autocomplete";
import { optionsMembership } from "@/constants/membership";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [membership, setMembership] = useState<IMemberResponse[]>([]);
  const methods = useForm({ defaultValues: { phoneNumber: "", type: "" } });
  const { phoneNumber, type } = methods.watch();

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await getAllMembership({
          search: phoneNumber,
          type,
        });
        if (response.data?.member) {
          setMembership(response.data.member);
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchMembership();
  }, [phoneNumber, type]);

  const onClear = () => {
    methods.setValue("phoneNumber", "");
    methods.setValue("type", "");
  };

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Membership</h2>
      </div>
      <Form methods={methods} className="w-1/2 grid grid-cols-5 gap-4">
        <div className="col-span-4 grid grid-cols-2 gap-4">
          <InputField
            name="phoneNumber"
            type="text"
            label="Search by phone number"
          />
          <AutocompleteForm
            options={optionsMembership}
            name="type"
            label="Membership Type"
          />
        </div>
        <CustomButton theme="alarm" text="clear" onHandleButton={onClear} />
      </Form>
      <div>
        <ReusableTable
          columns={columns}
          data={membership.filter((row) => row.isActive)}
          onRowClick={(row) =>
            router.push(`/admin/settings/membership/${row._id}`)
          }
        />
      </div>
    </div>
  );
};

export default Page;
