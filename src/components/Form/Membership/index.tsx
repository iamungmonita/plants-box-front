import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import {
  amountToPoint,
  getMembershipType,
} from "@/helpers/calculation/getPoint";
import {
  createMembership,
  getMembershipById,
  updateMembership,
} from "@/services/membership";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCartItems } from "@/hooks/useCartItems";
import { IMembership } from "@/models/Membership";
import AlertPopUp from "@/components/AlertPopUp";

const CreateForm = ({
  onClose,
  onAction,
  memberId,
}: {
  onClose?: () => void;
  onAction?: () => void;
  memberId?: string;
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
  const { watch } = methods;
  const phoneNumber = watch("phoneNumber");
  const isActive = watch("isActive");

  const { setValue } = methods;
  const [toggleAlert, setToggleAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [invoices, setInvoices] = useState<string[]>([]);
  const [purchasedOrderId, setPurchasedOrderId] = useState<string>("");
  const [error, setError] = useState(false);
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
    try {
      if (items) {
        if (!invoices.includes(purchasedOrderId)) {
          const updatedInvoice = [...invoices, purchasedOrderId];
          setInvoices(updatedInvoice);

          const points = amountToPoint(amount);
          const { purchasedId, ...dataWithoutPurchasedId } = data;
          const updatedData = {
            ...dataWithoutPurchasedId,
            points: points,
            invoices: updatedInvoice,
          };

          if (!memberId) {
            const response = await createMembership(updatedData);
            if (response.data) {
              if (onClose) {
                onClose();
              }
              setToggleAlert(true);
              setAlertMessage("Success!");
            } else {
              setToggleAlert(true);
              setError(true);
              setAlertMessage("Invoice already exists, not adding again.");
            }
          } else {
            const response = await updateMembership(memberId, {
              phoneNumber,
              isActive,
            });
            if (response.data) {
              if (onClose) {
                onClose();
              }
              setToggleAlert(true);
              setAlertMessage("Success!");
            } else {
              setToggleAlert(true);
              setError(true);
              setAlertMessage("Error updating.");
            }
          }
        }
      } else {
        setToggleAlert(true);
        setError(true);
        setAlertMessage("Must have items in the cart.");
      }
      if (!memberId) {
        methods.setValue("phoneNumber", "");
        methods.setValue("type", "");
        methods.setValue("isActive", true);
        methods.setValue("invoices", []);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  useEffect(() => {
    if (!memberId) return;
    const fetch = async () => {
      try {
        const response = await getMembershipById(memberId);
        if (response.data) {
          const invoice = response.data.invoices.map((row) => row);
          methods.setValue("phoneNumber", response.data?.phoneNumber);
          methods.setValue("type", response.data?.type);
          methods.setValue("isActive", response.data?.isActive);
          methods.setValue("invoices", invoice);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetch();
  }, [memberId]);
  return (
    <>
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <Form
        methods={methods}
        className="w-full max-w-[600px]  mx-auto p-2 space-y-6"
        onSubmit={onSubmitForm}
      >
        <h2 className="text-xl text-center">
          {memberId ? "Update" : "Create New"} Membership
        </h2>
        <InputField name="phoneNumber" type="text" label="Phone Number" />
        {!memberId && (
          <InputField name="purchasedId" label="Purchased ID" type="text" />
        )}
        {!memberId && <InputField name="type" label="Type" type="text" />}
        <Checkbox name="isActive" label="Is Active" />
        <div
          className={`${
            memberId ? " grid-cols-1 w-full" : " grid-cols-2"
          } grid gap-4`}
        >
          <CustomButton
            text={memberId ? "Update" : "Create"}
            roleCodes={["1008", "1013"]}
            type="submit"
            onHandleButton={onAction}
          />
          {!memberId && (
            <CustomButton text="Close" theme="alarm" onHandleButton={onClose} />
          )}
        </div>
      </Form>
    </>
  );
};

export default CreateForm;
