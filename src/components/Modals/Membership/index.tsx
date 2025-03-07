"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import AutocompleteForm from "@/components/Autocomplete";
import { IMembership, retrieveMembership } from "@/services/membership";

const Membership = ({ onClose }: { onClose?: () => void }) => {
  const [membership, setMembership] = useState<IMembership[]>([]);
  const methods = useForm({ defaultValues: { phoneNumber: "" } });
  const { watch } = methods;
  const phoneNumber = watch("phoneNumber");

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await retrieveMembership({ phoneNumber });
        if (response.data?.member) {
          setMembership(response.data.member);
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };
    fetchMembership();
  }, [phoneNumber]);

  const selectMembership = (id: string) => {
    const member = membership.find((member) => member._id === id);
    localStorage.setItem("membership", JSON.stringify(member));
    window.dispatchEvent(new Event("memberUpdated"));
  };

  return (
    <div className="flex flex-col min-h-full w-3/4 gap-4">
      <Form methods={methods} className="w-full gap-4 grid grid-cols-5">
        <div className="col-span-4">
          <AutocompleteForm
            name="phoneNumber"
            label="Check membership"
            options={membership.map((member) => ({
              label: `${member.firstName} ${member.lastName} (${member.phoneNumber})`, // Show both name and phone number
              value: member.phoneNumber, // Use phone number as value
            }))}
            onChange={(value) => {
              // Find the member using the phone number and then pass its id to selectMembership
              const selectedMember = membership.find(
                (member) => member.phoneNumber === value
              );
              if (selectedMember) {
                selectMembership(selectedMember._id); // Pass the id of the selected member
              }
            }}
          />
        </div>
        <CustomButton text="close" theme="alarm" onHandleButton={onClose} />
      </Form>
    </div>
  );
};

export default Membership;
