"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import AutocompleteForm from "@/components/Autocomplete";
import { getAllMembership, IMemberResponse } from "@/services/membership";
import BasicModal from "@/components/Modal";
import CreateForm from "@/components/Form/Membership";
import { getDiscountValue } from "@/constants/membership";
import AlertPopUp from "@/components/AlertPopUp";

const Membership = ({ onClose }: { onClose?: () => void }) => {
  const [membership, setMembership] = useState<IMemberResponse[]>([]);
  const [member, setMember] = useState<IMemberResponse>();
  const [invoices, setInvoices] = useState<string[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [exist, setExist] = useState<boolean>(false);
  const [toggleAlert, setToggleAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const methods = useForm({ defaultValues: { phoneNumber: "" } });
  const { watch } = methods;
  const phoneNumber = watch("phoneNumber");

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await getAllMembership({ phoneNumber });
        if (response.data?.member) {
          setMembership(response.data.member);
          const invoices = response.data.member.flatMap(
            (member) => member.invoices
          );
          setInvoices(invoices);
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };
    fetchMembership();
  }, [phoneNumber]);

  const orderId = localStorage.getItem("lastOrderId") ?? "";
  useEffect(() => {
    if (invoices && orderId) {
      const orderExists = invoices.includes(orderId);
      if (orderExists) {
        setExist(true); // Set to true when order exists
      } else {
        setExist(false);
      }
    }
  }, [invoices, orderId]);

  const selectMembership = (id: string) => {
    const member = membership.find((member) => member._id === id);
    setMember(member);
  };
  const handleClose = () => {
    setToggle(false);
    if (onClose) {
      onClose();
    }
  };
  const selectPoints = () => {
    const stored = {
      phone: member?.phoneNumber,
      point: member?.points, // Default value
    };
    localStorage.setItem("membership", JSON.stringify(stored));
    window.dispatchEvent(new Event("memberUpdated"));
  };
  const selectDiscount = () => {
    const stored = {
      phone: member?.phoneNumber,
      discount: getDiscountValue(member?.type as string), // Default value
    };
    localStorage.setItem("membership", JSON.stringify(stored));
    window.dispatchEvent(new Event("memberUpdated"));
  };

  return (
    <div className="flex flex-col min-h-full w-full gap-4">
      <BasicModal
        ContentComponent={CreateForm}
        onClose={handleClose}
        open={toggle}
      />
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <Form methods={methods} className="w-full gap-4 grid grid-cols-4">
        <div className="col-span-4">
          <AutocompleteForm
            name="phoneNumber"
            label="Phone Number"
            options={membership.map((member) => ({
              label: `${member.phoneNumber} (${member.type})`,
              value: member.phoneNumber,
            }))}
            onChange={(value) => {
              const selectedMember = membership.find(
                (member) => member.phoneNumber === value
              );
              if (selectedMember) {
                selectMembership(selectedMember._id);
              }
            }}
          />
        </div>

        {member && (
          <div className="grid grid-cols-3 col-span-4 gap-4 justify-between items-center">
            <p className="col-span-1">
              {member.phoneNumber} ({member.type})
            </p>
            <div className=" gap-4  col-span-2 grid grid-cols-2">
              <CustomButton
                theme="general"
                text={`${String(member.points)} Points`}
                onHandleButton={selectPoints}
              />
              <CustomButton
                theme="general"
                text={getDiscountValue(member.type).toString()}
                onHandleButton={selectDiscount}
              />
            </div>
          </div>
        )}
        <div className="col-span-4 grid grid-cols-2 gap-4">
          <CustomButton
            theme={exist ? "dark" : ""}
            disabled={exist}
            text="Create New Membership"
            onHandleButton={() => setToggle(true)}
          />
          <CustomButton text="close" theme="alarm" onHandleButton={onClose} />
        </div>
      </Form>
    </div>
  );
};

export default Membership;
