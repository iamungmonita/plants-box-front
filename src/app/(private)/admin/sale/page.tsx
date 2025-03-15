"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getOrder } from "@/services/order";
import ReusableTable from "@/components/Table";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Orders";
import InputField from "@/components/InputText";
import Form from "@/components/Form";
import CustomButton from "@/components/Button";
import { PurchasedOrderList } from "@/models/Order";
import API_URL from "@/lib/api";
import { ArrowDownward } from "@mui/icons-material";

const Page = () => {
  const [orders, setOrders] = useState<PurchasedOrderList[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<number>(0);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);

  const methods = useForm({
    defaultValues: {
      purchasedId: "",
    },
  });

  const purchasedId = methods.watch("purchasedId");
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getOrder({
          purchasedId:
            purchasedId && purchasedId.trim() !== "" ? purchasedId : undefined,
          start: selectedStartDate ?? undefined,
          end: selectedEndDate ?? undefined,
        });
        if (response.data) {
          setOrders(response.data.orders);
          setAmount(response.data.amount);
          setTransactions(response.data.count);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProduct();
  }, [purchasedId, selectedEndDate, selectedStartDate]);
  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDate = event.target.value; // The value will be in YYYY-MM-DD format
    setSelectedStartDate(newDate || null); // This triggers the second useEffect hook
  };
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value; // The value will be in YYYY-MM-DD format
    setSelectedEndDate(newDate || null); // This triggers the second useEffect hook
  };

  const clearAll = () => {
    methods.setValue("purchasedId", "");
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(
        `${API_URL}/order/download-excel?end=${selectedEndDate}&start=${selectedStartDate}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-xl">Sale Records</h2>
        <Form
          methods={methods}
          className="grid grid-cols-8 mt-4 items-center justify-between gap-4"
        >
          <div className="col-span-3 grid grid-cols-5 gap-4">
            <div className="col-span-4">
              <InputField
                name="purchasedId"
                type="text"
                label="Search Purchased ID"
                placeholder="PO-00001"
              />
            </div>
            <CustomButton
              text="Clear"
              theme="alarm"
              onHandleButton={clearAll}
            />
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-4 w-full items-center">
            <div className="flex items-center justify-end gap-4">
              <label>From:</label>
              <input
                className="border rounded p-3.5 bg-gray-100"
                type="date"
                id="startDateInput"
                placeholder="Start Date"
                value={selectedStartDate || ""} // Binding state to input
                onChange={handleStartDateChange} // Handling date change
              />
            </div>
            <div className="flex items-center justify-start gap-4">
              <label>To:</label>
              <input
                className="border rounded p-3.5 bg-gray-100"
                type="date"
                id="endDateInput"
                value={selectedEndDate || ""} // Binding state to input
                onChange={handleEndDateChange} // Handling date change
              />
            </div>
          </div>
          <div className="flex items-end flex-col">
            <p>
              <span className="font-bold">Total: </span>
              <span>${amount.toFixed(2)}</span>
            </p>
            <p>
              <span className="font-bold">Transactions: </span>
              <span>{transactions}</span>
            </p>
          </div>
          <div className="w-3/4">
            <CustomButton
              onHandleButton={handleDownloadExcel}
              text="Excel"
              icon={ArrowDownward}
            />
          </div>
        </Form>
        {orders.length > 0 ? (
          <ReusableTable
            columns={columns}
            data={orders}
            onRowClick={(row) => router.push(`/admin/sale/${row.purchasedId}`)}
          />
        ) : (
          <div>No result matches this filter.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
