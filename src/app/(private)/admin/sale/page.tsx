"use client";
import { PurchasedOrderList } from "@/schema/Order";
import { getProductById } from "@/services/products";
import { MdClose, MdEditDocument } from "react-icons/md";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formattedTimeStamp } from "@/helpers/format/time";
import BasicModal from "@/components/Modal";
import dynamic from "next/dynamic";
import API_URL from "@/lib/api";
import { getOrder } from "@/services/order";
import ReusableTable from "@/components/Table";
import { useForm } from "react-hook-form";
import { Column } from "@/constants/TableHead/Product";
import { Button, TextField } from "@mui/material";
import Head from "next/head"; // Use next/head for title
import { columns } from "@/constants/TableHead/Orders";
import InputField from "@/components/InputText";
import Form from "@/components/Form";
import CustomButton from "@/components/Button";

const Page = () => {
  const [title, setTitle] = useState("");
  const params = useParams();
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
  const [id, setId] = useState("");

  useEffect(() => {
    if (!params?.id) return; // Ensure params are available
    setId(params.id as string); // Extract id safely
  }, [params]);

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

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-xl">Sale Records</h2>
        <Form
          methods={methods}
          className="grid grid-cols-7 mt-4 items-center gap-4"
        >
          <div className="col-span-4 grid grid-cols-5 gap-4">
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
          <input
            className="border rounded p-3.5 bg-gray-100"
            type="date"
            id="startDateInput"
            value={selectedStartDate || ""} // Binding state to input
            onChange={handleStartDateChange} // Handling date change
          />
          <input
            className="border rounded p-3.5 bg-gray-100"
            type="date"
            id="endDateInput"
            value={selectedEndDate || ""} // Binding state to input
            onChange={handleEndDateChange} // Handling date change
          />
          <div className="text-sm">
            <p className="">
              <span>Total: </span>
              <span>${amount.toFixed(2)}</span>
            </p>
            <p className="">
              <span>Transactions: </span>
              <span>{transactions}</span>
            </p>
          </div>
        </Form>
        {orders.length > 0 ? (
          <ReusableTable
            columns={columns}
            data={orders}
            onRowClick={(row) => router.push(`/admin/sale/${row.purchasedId}`)}
          />
        ) : (
          <div>No orders have been recorded for this product.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
