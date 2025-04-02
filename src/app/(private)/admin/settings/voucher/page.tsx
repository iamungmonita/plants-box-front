"use client";

import ReusableTable from "@/components/Table";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { columns } from "@/constants/TableHead/Voucher";
import { getAllVouchers } from "@/services/system";
import CustomButton from "@/components/Button";
import { VoucherResponse } from "@/models/Voucher";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useForm } from "react-hook-form";

const Page = () => {
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      search: "",
    },
  });
  const search = methods.watch("search");
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllVouchers({ search });
        setVouchers(response.data ?? []);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchRoles();
  }, [search]);

  const onClear = () => {
    methods.setValue("search", "");
  };

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Voucher</h2>
        <div className="w-42">
          <CustomButton
            roleCodes={["1009"]}
            text="Create Voucher"
            path="/admin/settings/voucher/create"
          />
        </div>
      </div>
      <Form methods={methods} className="w-1/4 grid grid-cols-3 gap-4">
        <div className="col-span-2 gap-4">
          <InputField
            name="search"
            type="text"
            label="Search by name or barcode"
          />
        </div>
        <CustomButton theme="alarm" text="clear" onHandleButton={onClear} />
      </Form>
      <div>
        <ReusableTable
          columns={columns}
          data={vouchers}
          onRowClick={(row) =>
            router.push(`/admin/settings/voucher/${row._id}`)
          }
        />
      </div>
    </div>
  );
};

export default Page;
