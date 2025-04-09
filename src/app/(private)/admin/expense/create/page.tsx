"use client";

import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertPopUp from "@/components/AlertPopUp";
import { ExpenseForm } from "@/models/Expense";
import AutocompleteForm from "@/components/Autocomplete";
import { expensesCategory } from "@/constants/Expense";
import { useParams } from "next/navigation";
import { formattedTimeStamp } from "@/helpers/format/time";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import {
  CreateExpense,
  getExpenseById,
  updateExpenseById,
} from "@/services/system";

const Page = () => {
  const params = useParams();
  const [toggleAlert, setToggleAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const router = useRouter();

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

  const expenseId = params?.expenseId as string;
  const { asObject: expense, error: fetchError } = useFetch(
    getExpenseById,
    { params: { id: expenseId } },
    [expenseId]
  );

  useEffect(() => {
    if (!expenseId) return;
    if (expense) {
      const selectedCategory = expensesCategory.find(
        (category) => category.value === expense.category
      );
      if (selectedCategory) {
        methods.setValue("category", selectedCategory.value ?? "");
      }
      methods.setValue("amount", expense.amount);
      methods.setValue("supplier", expense.supplier);
      methods.setValue("invoice", expense.invoice);
      methods.setValue("remarks", expense.remarks);
      setSelectedDate(formattedTimeStamp(expense.date as string, "YYYY-MM-DD"));
    } else if (fetchError) {
      setAlertMessage(fetchError);
      setError(true);
      setToggleAlert(true);
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  }, [params, expense, fetchError]);

  const onSubmitForm = async (form: ExpenseForm) => {
    try {
      const newForm = {
        ...form,
        date: selectedDate as string,
      };
      const response = expenseId
        ? await updateExpenseById(expenseId, newForm)
        : await CreateExpense(newForm);

      if (response.data && !expenseId) {
        methods.setValue("category", "");
        methods.setValue("amount", 0);
        methods.setValue("supplier", "");
        methods.setValue("remarks", "");
        methods.setValue("invoice", "");
        setSelectedDate(null);
      }
      setToggleAlert(true);
      setError(false);
      setAlertMessage("Success!");
    } catch (error: any) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(error.message);
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
            {expenseId ? "Update" : "Create"} Expense
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
            <CustomButton
              roleCodes={expenseId ? ["1010"] : ["1005"]}
              text={expenseId ? "Update" : "Creates"}
              type="submit"
            />
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
