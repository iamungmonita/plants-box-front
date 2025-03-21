"use client";

import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import { CreateRole, CreateVoucher } from "@/services/system";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AlertPopUp from "@/components/AlertPopUp";
import { IRole } from "@/models/Roles";
import { VoucherForm } from "@/models/Voucher";

const Page = () => {
  const [toggleAlert, setToggleAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const methods = useForm<VoucherForm>({
    defaultValues: {
      barcode: "",
      discount: 0,
      validFrom: "",
      validTo: "",
    },
  });
  const { profile } = useAuthContext();
  const onSubmitForm = async (form: VoucherForm) => {
    const newForm = {
      ...form,
      validFrom: selectedStartDate,
      validTo: selectedEndDate,
    };
    const response = await CreateVoucher(newForm);
    if (response.message) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(response.message);
    } else {
      setToggleAlert(true);
      setError(false);
      setAlertMessage("Success!");
      methods.setValue("barcode", "");
      methods.setValue("discount", 0);
      setSelectedEndDate(null);
      setSelectedStartDate(null);
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
            Create Voucher
          </h2>
          <Form
            methods={methods}
            className="grid grid-cols-1  p-2 space-y-6"
            onSubmit={onSubmitForm}
          >
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
                  value={selectedStartDate || ""} // Binding state to input
                  onChange={handleStartDateChange} // Handling date change
                />
              </div>
              <div className="grid grid-cols-3 items-center justify-between col-span-1 gap-4">
                <label>Valid To:</label>
                <input
                  className="border w-full col-span-2 rounded p-3.5 bg-gray-100"
                  type="date"
                  id="startDateInput"
                  value={selectedEndDate || ""} // Binding state to input
                  onChange={handleEndDateChange} // Handling date change
                />
              </div>
            </div>

            <CustomButton text="Create" type="submit" />
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
