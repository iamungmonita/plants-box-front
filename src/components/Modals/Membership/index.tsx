"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import AutocompleteForm from "@/components/Autocomplete";
import { IMembership, retrieveMembership } from "@/services/membership";
import BasicModal from "@/components/Modal";
import CreateForm from "@/app/(private)/admin/settings/membership/create/Form";
import { useMembership } from "@/hooks/useMembership";

const Membership = ({ onClose }: { onClose?: () => void }) => {
  const [membership, setMembership] = useState<IMembership[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const methods = useForm({ defaultValues: { phoneNumber: "" } });
  const { watch, setValue } = methods;
  const phoneNumber = watch("phoneNumber");
  const { member } = useMembership();

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
  const handleClose = () => {
    setToggle(false);
    if (onClose) {
      onClose(); // Ensure onClose is actually called
    }
  };

  return (
    <div className="flex flex-col min-h-full w-3/4 gap-4">
      <BasicModal
        ContentComponent={CreateForm}
        onClose={handleClose}
        open={toggle}
      />
      <Form methods={methods} className="w-full gap-4 grid grid-cols-4">
        <div className="col-span-4">
          <AutocompleteForm
            name="phoneNumber"
            label="Name or Phone Number"
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
        <div className="col-span-4 grid grid-cols-2 gap-4">
          <CustomButton
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
