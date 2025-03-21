"use client";

import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import { CreateExpense } from "@/services/system";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AlertPopUp from "@/components/AlertPopUp";
import { ExpenseForm } from "@/models/Expensese";
import AutocompleteForm from "@/components/Autocomplete";
import { expensesCategory } from "@/constants/Expense";

const Page = () => {
  const [toggleAlert, setToggleAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const methods = useForm<ExpenseForm>({
    defaultValues: {
      category: "",
      amount: 0,
      date: "",
      supplier: "",
      invoice: "",
      remarks: "",
    },
  });
  const { profile } = useAuthContext();
  const onSubmitForm = async (form: ExpenseForm) => {
    const newForm = {
      ...form,
      date: selectedDate as string,
    };
    const response = await CreateExpense(newForm);
    if (response.message) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(response.message);
    } else {
      setToggleAlert(true);
      setError(false);
      setAlertMessage("Success!");
      methods.setValue("category", "");
      methods.setValue("amount", 0);
      methods.setValue("supplier", "");
      methods.setValue("remarks", "");
      methods.setValue("invoice", "");
      setSelectedDate(null);
    }
  };
  const handleDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate || null);
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
              <AutocompleteForm
                options={expensesCategory}
                name="category"
                label="Category"
              />
              <InputField name="amount" type="number" label="Amount" />
              <InputField name="supplier" type="text" label="Supplier" />
              <InputField name="invoice" type="text" label="Invoice" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 items-center justify-between col-span-1 gap-4">
                <label>Expense Date:</label>
                <input
                  className="border w-full col-span-2 rounded p-3.5 bg-gray-100"
                  type="date"
                  id="date"
                  value={selectedDate || ""}
                  onChange={handleDate}
                />
              </div>
            </div>
            <InputField
              name="remarks"
              multiline
              minRows={3}
              type="text"
              label="Remarks"
            />
            <CustomButton text="Create" type="submit" />
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
