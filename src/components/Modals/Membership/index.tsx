"use client";

import ReusableTable from "@/components/Table";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "@/constants/TableHead/Membership";
import { RetrieveRoles } from "@/services/system";
import CustomButton from "@/components/Button";
import {
  IMember,
  IMembershipResponse,
  retrieveMembership,
} from "@/services/membership";
import Form from "@/components/Form";
import InputField from "@/components/InputText";

const Membership = () => {
  const [roles, setRoles] = useState<IMember[]>([]);
  const methods = useForm({ defaultValues: { phonenumber: "" } });
  const { watch } = methods;
  const phonenumber = watch("phonenumber");
  useEffect(() => {
    const fetchMembership = async () => {
      setTimeout(async () => {
        try {
          const response = await retrieveMembership({ phonenumber });
          if (response.data?.member) {
            setRoles(response.data.member);
          }
        } catch (error) {
          console.error("Error uploading:", error);
        }
      }, 2000);
    };
    fetchMembership();
  }, [phonenumber]);
  const selectMembership = (id: string) => {
    const member = roles.find((role) => role._id === id);
    localStorage.setItem("membership", JSON.stringify(member));
    window.dispatchEvent(new Event("memberUpdated"));
  };
  return (
    <div className="flex flex-col w-3/4 gap-4">
      <Form methods={methods} className="w-full">
        <InputField name="phonenumber" type="text" label="Phone Number" />
      </Form>
      <div className="w-full border-b">
        {phonenumber && roles.length > 0 ? (
          roles.map((role) => (
            <div
              onClick={() => selectMembership(role._id)}
              key={role._id}
              className="items-center justify-between rounded-lg flex gap-4"
            >
              <p className="p-2">
                {role.firstname} {role.lastname}
              </p>
              <p className=" p-2 w-32 h-full">{role.type}</p>
            </div>
          ))
        ) : (
          <p>No roles found or phone number doesn't match condition.</p>
        )}
      </div>
    </div>
  );
};

export default Membership;
