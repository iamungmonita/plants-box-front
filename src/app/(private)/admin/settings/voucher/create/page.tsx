"use client";

import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import {
  CreateVoucher,
  getVoucherById,
  updateVoucherById,
} from "@/services/system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertPopUp from "@/components/AlertPopUp";
import { VoucherForm } from "@/models/Voucher";
import { useParams } from "next/navigation";
import { formattedTimeStamp } from "@/helpers/format/time";
const Page = () => {
  const params = useParams();
  const [toggleAlert, setToggleAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [voucherId, setVoucherId] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const methods = useForm<VoucherForm>({
    defaultValues: {
      name: "",
      barcode: "",
      discount: 0,
      validFrom: "",
      validTo: "",
    },
  });
  useEffect(() => {
    if (!params?.voucherId) return;
    setVoucherId(params.voucherId as string);
  }, [params]);

  const onSubmitForm = async (form: VoucherForm) => {
    const newForm = {
      ...form,
      validFrom: selectedStartDate || "", // Ensure valid values
      validTo: selectedEndDate || "",
    };
    const response = voucherId
      ? await updateVoucherById(voucherId, newForm)
      : await CreateVoucher(newForm);
    if (response.message) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(response.message);
    } else {
      setToggleAlert(true);
      setError(false);
      setAlertMessage("Success!");
      if (!voucherId) {
        methods.setValue("barcode", "");
        methods.setValue("discount", 0);
        setSelectedEndDate("");
        setSelectedStartDate("");
      }
    }
  };
  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDate = event.target.value;
    setSelectedStartDate(newDate || null);
  };
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedEndDate(newDate || null);
  };

  useEffect(() => {
    if (!voucherId) return; // Prevent running without a voucherId
    const fetch = async () => {
      const response = await getVoucherById(voucherId);
      if (response.data) {
        methods.setValue("name", response.data.name);
        methods.setValue("barcode", response.data.barcode);
        methods.setValue("isActive", response.data.isActive);
        setSelectedStartDate(
          formattedTimeStamp(response.data.validFrom as string, "YYYY-MM-DD")
        );
        setSelectedEndDate(
          formattedTimeStamp(response.data.validTo as string, "YYYY-MM-DD")
        );
        methods.setValue("discount", response.data.discount);
      } else {
        console.log("error retrieving voucher...");
      }
    };
    fetch();
  }, [voucherId]);

  return (
    <>
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="max-w-[500px] w-full">
          <h2 className="text-center font-semibold text-lg uppercase mb-5">
            {voucherId ? "Update" : "Create"} Voucher
          </h2>
          <Form
            methods={methods}
            className="grid grid-cols-1  p-2 space-y-6"
            onSubmit={onSubmitForm}
          >
            <div className="grid grid-cols-1 gap-4">
              <InputField name="name" type="text" label="Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField name="barcode" type="text" label="Barcode" />
              <InputField name="discount" type="number" label="Discount" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 items-center justify-between col-span-1 gap-4">
                <label>Valid From:</label>
                <input
                  className="border w-full col-span-2 rounded p-3.5 bg-gray-100"
                  type="date"
                  id="startDateInput"
                  value={selectedStartDate || ""} // Ensure controlled component
                  onChange={handleStartDateChange} // Handling date change
                />
              </div>
              <div className="grid grid-cols-3 items-center justify-between col-span-1 gap-4">
                <label>Valid To:</label>
                <input
                  className="border w-full col-span-2 rounded p-3.5 bg-gray-100"
                  type="date"
                  id="endDateInput"
                  value={selectedEndDate || ""} // Ensure controlled component
                  onChange={handleEndDateChange} // Handling date change
                />
              </div>
            </div>

            <CustomButton
              text={voucherId ? "Update" : "Create"}
              roleCodes={["1009, 1014"]}
              type="submit"
            />
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
