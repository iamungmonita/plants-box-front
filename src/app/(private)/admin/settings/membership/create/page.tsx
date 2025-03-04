"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import AutocompleteForm from "@/components/Autocomplete";
import Checkbox from "@/components/Checkbox";
import CustomButton from "@/components/Button";
import { CreateMembership, IMembership } from "@/services/membership";
import { getOrder, PurchasedOrderList } from "@/services/order";
import { optionsMembership } from "@/constants/membership";
import { amountToPoint, pointToAmount } from "@/helpers/calculation/getPoint";

const Page = () => {
  const methods = useForm<IMembership>({
    defaultValues: {
      type: "",
      firstname: "",
      lastname: "",
      phonenumber: "",
      email: "",
      isActive: true,
      purchasedId: "",
      invoice: [], // It's an array of invoices
      points: 0,
    },
  });
  const { watch, setValue, handleSubmit, register } = methods;

  const purchasedId = watch("purchasedId");
  const [invoices, setInvoices] = useState<string[]>([]);

  const onSubmitForm = async (data: IMembership) => {
    console.log(data);
    const response = await CreateMembership(data);
    if (response.message) {
      console.log(response.message);
    }
    if (response.data) {
      console.log(data);
    } else {
      console.log(response.message);
    }
  };

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await getOrder({ purchasedId });
        if (response.data) {
          // Map the data to push the invoices into the form field
          const orderInvoices = response.data?.orders.map(
            (order: PurchasedOrderList) => order.purchasedId
          );
          const getAmount = response.data.orders.filter((order) => order);
          const points = amountToPoint(Number(getAmount[0].amount));
          const money = pointToAmount(Number(points));
          console.log(points, money);
          setInvoices(orderInvoices);

          // Push all invoices to the 'invoice' array in the form
          setValue("invoice", orderInvoices);
          setValue("points", points);
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchMembership();
  }, [purchasedId, setValue]);

  const options = optionsMembership.map((option) => option.label);

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
            <InputField name="firstname" type="text" label="First Name" />
            <InputField name="lastname" type="text" label="Last Name" />
          </div>
          <InputField name="email" type="email" label="Email" />
          <InputField name="phonenumber" type="text" label="Phone Number" />
          <InputField name="purchasedId" type="text" label="PurchasedId" />
          <AutocompleteForm options={options} name="type" label="Type" />

          {/* This will now display the list of invoices */}
          <input
            value={invoices.join(", ")}
            {...register("invoice")}
            readOnly
          />

          <Checkbox name="isActive" />
          <CustomButton text="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
