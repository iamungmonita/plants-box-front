"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import AutocompleteForm from "@/components/Autocomplete";
import Checkbox from "@/components/Checkbox";
import CustomButton from "@/components/Button";
import { CreateMembership, IMembership } from "@/services/membership";
import {
  getPurchasedOrderByPurchasedId,
  PurchasedOrderList,
} from "@/services/order";
import { optionsMembership } from "@/constants/membership";
import { amountToPoint, sum } from "@/helpers/calculation/getPoint";
import { useAuthContext } from "@/context/AuthContext";
import ImageUpload from "@/components/Upload";

const Page = () => {
  const methods = useForm<IMembership>({
    defaultValues: {
      type: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isActive: true,
      purchasedId: "",
    },
  });
  const { watch, setValue, handleSubmit, register } = methods;
  const purchasedId = watch("purchasedId");

  const { profile } = useAuthContext();
  const [invoices, setInvoices] = useState<
    { purchasedId: string; totalAmount: number }[]
  >([]);
  const [orders, setOrders] = useState<PurchasedOrderList | null>(null);

  const onSubmitForm = async (data: IMembership) => {
    // If `data.invoice` is an array, append the `purchasedId` to it

    if (orders) {
      const updatedInvoice = [
        ...invoices,
        {
          purchasedId: orders.purchasedId, // Extract the purchasedId
          totalAmount: orders.totalAmount, // Extract the totalAmount
        },
      ];
      setInvoices(updatedInvoice);
      const acc = updatedInvoice.map((invoice) => invoice.totalAmount);
      const total = sum(acc);
      const points = amountToPoint(total);
      const { purchasedId, ...dataWithoutPurchasedId } = data;
      const updatedData = {
        ...dataWithoutPurchasedId,
        points: points,
        createdBy: profile?.firstName as string,
        invoices: updatedInvoice, // Assign the manually managed invoice list to the data
      };

      const response = await CreateMembership(updatedData);
      if (response.data) {
        console.log(response.data);
      } else {
        console.log(response.message);
      }
    } else {
      console.log("not found");
    }
  };
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await getPurchasedOrderByPurchasedId(purchasedId);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setOrders(response.data[0]); // ✅ Safely extract the first object
        } else {
          console.warn(
            "No orders found or invalid response format:",
            response.data
          );
          setOrders({} as PurchasedOrderList); // Fallback to an empty object
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };

    if (purchasedId) fetchMembership();
  }, [purchasedId]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[500px] w-full">
        <h2 className="text-center font-bold text-xl mb-5">
          Create Membership
        </h2>
        <Form
          methods={methods}
          className="grid grid-cols-1 p-2 space-y-6"
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <div className="grid grid-cols-2 gap-4">
            <InputField name="firstName" type="text" label="First Name" />
            <InputField name="lastName" type="text" label="Last Name" />
          </div>
          <InputField name="phoneNumber" type="text" label="Phone Number" />
          <InputField name="purchasedId" label="Purchased ID" type="text" />
          <AutocompleteForm
            options={optionsMembership}
            name="type"
            label="Membership Type"
          />
          <Checkbox name="isActive" label="Is Active" />

          <CustomButton text="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
