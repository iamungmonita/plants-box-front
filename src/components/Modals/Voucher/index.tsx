"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import AutocompleteForm from "@/components/Autocomplete";
import BasicModal from "@/components/Modal";
import CreateForm from "@/components/Form/Membership";
import { getAllVouchers } from "@/services/system";
import { VoucherResponse } from "@/models/Voucher";
import { formattedTimeStamp } from "@/helpers/format/time";

const Voucher = ({ onClose }: { onClose?: () => void }) => {
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const [voucher, setVoucher] = useState<VoucherResponse | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);

  const methods = useForm({ defaultValues: { barcode: "" } });
  const { watch } = methods;
  const barcode = watch("barcode");

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getAllVouchers({ barcode });
        if (response.data) {
          const filtered = response.data.filter(
            (voucher) => !voucher.isExpired && voucher.isActive
          );
          setVouchers(filtered);
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };
    fetch();
  }, [barcode]);

  const handleClose = () => {
    setToggle(false);
    if (onClose) {
      onClose();
    }
  };

  const selectVoucher = (barcode: string) => {
    const match = vouchers.find((voucher) => voucher.barcode === barcode);
    setVoucher(match ? match : null);
    const stored = {
      barcode: match?.barcode,
      discount: match?.discount, // Default value
    };
    localStorage.setItem("voucher", JSON.stringify(stored));
    window.dispatchEvent(new Event("voucherUpdated"));
  };

  return (
    <div className="flex flex-col min-h-full w-full gap-4">
      <BasicModal
        ContentComponent={CreateForm}
        onClose={handleClose}
        open={toggle}
      />
      <Form
        methods={methods}
        className="w-full gap-4 grid justify-end grid-cols-4"
      >
        <div className="col-span-4">
          <AutocompleteForm
            name="barcode"
            label="Barcode"
            options={vouchers.map((voucher) => ({
              label: `${voucher.barcode.toUpperCase()} (${formattedTimeStamp(
                voucher.validFrom as string
              )}  - ${formattedTimeStamp(voucher.validTo as string)})`,
              value: voucher.barcode,
            }))}
            onChange={(value) => {
              const selectedVoucher = vouchers.find(
                (voucher) => voucher.barcode === value
              );
              if (selectedVoucher) {
                selectVoucher(selectedVoucher.barcode);
              }
            }}
          />
        </div>
        <div className="col-span-2">
          <CustomButton text="close" theme="alarm" onHandleButton={onClose} />
        </div>
      </Form>
    </div>
  );
};

export default Voucher;
