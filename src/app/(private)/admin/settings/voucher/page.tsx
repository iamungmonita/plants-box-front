"use client";

import ReusableTable from "@/components/Table";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { columns } from "@/constants/TableHead/Voucher";
import { getAllVouchers } from "@/services/system";
import CustomButton from "@/components/Button";
import { VoucherResponse } from "@/models/Voucher";

const Page = () => {
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllVouchers({});
        setVouchers(response.data ?? []);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen justify-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Voucher</h2>
        <div className="w-42">
          <CustomButton
            roleCodes={["1001"]}
            text="Create Voucher"
            path="/admin/settings/voucher/create"
          />
        </div>
      </div>
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
