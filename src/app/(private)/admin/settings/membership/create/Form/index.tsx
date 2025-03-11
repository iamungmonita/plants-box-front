import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { optionsMembership } from "@/constants/membership";
import { useAuthContext } from "@/context/AuthContext";
import {
  amountToPoint,
  getMembershipType,
} from "@/helpers/calculation/getPoint";
import { PurchasedOrderList } from "@/schema/order";
import { CreateMembership, IMembership } from "@/services/membership";
import { getPurchasedOrderByPurchasedId } from "@/services/order";
import { useMembership } from "@/hooks/useMembership";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCartItems } from "@/hooks/useCartItems";
import { ShoppingCartProduct } from "@/models/Cart";

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
  const { watch, setValue, handleSubmit, register } = methods;
  const { profile } = useAuthContext();
  const [invoices, setInvoices] = useState<string[]>([]);
  const [orders, setOrders] = useState<ShoppingCartProduct[]>([]);
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
      const updatedInvoice = [...invoices, purchasedOrderId];
      setInvoices(updatedInvoice);

      const points = amountToPoint(amount);
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
  //   useEffect(() => {
  //     const fetchMembership = async () => {
  //       try {
  //         const response = await getPurchasedOrderByPurchasedId(purchasedId);
  //
  //         if (Array.isArray(response.data) && response.data.length > 0) {
  //           setOrders(response.data[0]); // ✅ Safely extract the first object
  //         } else {
  //           console.warn(
  //             "No orders found or invalid response format:",
  //             response.data
  //           );
  //           setOrders({} as PurchasedOrderList); // Fallback to an empty object
  //         }
  //       } catch (error) {
  //         console.error("Error fetching membership:", error);
  //       }
  //     };
  //
  //     fetchMembership();
  //   }, [purchasedId, member]);
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <>
      <Form
        methods={methods}
        className="grid grid-cols-1 p-2 space-y-6"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <h2 className="text-xl text-center">Create New Membership</h2>
        <div className="grid grid-cols-2 gap-4">
          <InputField name="firstName" type="text" label="First Name" />
          <InputField name="lastName" type="text" label="Last Name" />
        </div>
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
