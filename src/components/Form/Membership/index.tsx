import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import {
  amountToPoint,
  getMembershipType,
} from "@/helpers/calculation/getPoint";
import { CreateMembership } from "@/services/membership";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCartItems } from "@/hooks/useCartItems";
import { IMembership } from "@/models/Membership";

const CreateForm = ({
  onClose,
  onAction,
}: {
  onClose?: () => void;
  onAction?: () => void;
}) => {
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
  const { setValue, handleSubmit } = methods;
  const { profile } = useAuthContext();
  const [invoices, setInvoices] = useState<string[]>([]);
  const [purchasedOrderId, setPurchasedOrderId] = useState<string>("");
  const { items, amount } = useCartItems();

  useEffect(() => {
    const orderId = localStorage.getItem("lastOrderId") ?? "";
    if (orderId) {
      setValue("purchasedId", orderId);
      setPurchasedOrderId(orderId);
      setValue("type", getMembershipType(amount));
    }
  }, [items]);

  const onSubmitForm = async (data: IMembership) => {
    if (items) {
      if (!invoices.includes(purchasedOrderId)) {
        const updatedInvoice = [...invoices, purchasedOrderId];
        setInvoices(updatedInvoice);

        const points = amountToPoint(amount);
        const { purchasedId, ...dataWithoutPurchasedId } = data;
        const updatedData = {
          ...dataWithoutPurchasedId,
          points: points,
          createdBy: profile?.firstName as string,
          invoices: updatedInvoice,
        };

        const response = await CreateMembership(updatedData);
        if (response.data) {
          if (onClose) {
            onClose();
          }
        } else {
          alert("Failed to create membership"); // Alert message for failure
        }
      } else {
        console.log("Invoice already exists, not adding again.");
      }
    } else {
      console.log("Items not found");
    }
  };

  return (
    <>
      <Form
        methods={methods}
        className="w-full p-2 space-y-6"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <h2 className="text-xl text-center">Create New Membership</h2>
        <InputField name="phoneNumber" type="text" label="Phone Number" />
        <InputField name="purchasedId" label="Purchased ID" type="text" />
        <InputField name="type" label="Type" type="text" />

        <Checkbox name="isActive" label="Is Active" />
        <div className="grid grid-cols-2 gap-4">
          <CustomButton text="Create" type="submit" onHandleButton={onAction} />
          <CustomButton text="Close" theme="alarm" onHandleButton={onClose} />
        </div>
      </Form>
    </>
  );
};

export default CreateForm;
