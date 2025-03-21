"use client";

import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import { CreateRole } from "@/services/system";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AlertPopUp from "@/components/AlertPopUp";
import { IRole } from "@/models/Roles";

const Page = () => {
  const [toggleAlert, setToggleAlert] = useState(false);
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const methods = useForm<IRole>({
    defaultValues: {
      name: "",
      codes: [],
      remarks: "",
      isActive: true,
    },
  });
  // const { profile } = useAuthContext();
  const onSubmitForm = async (form: IRole) => {
    const response = await CreateRole(form);
    if (response.message) {
      setToggleAlert(true);
      setError(true);
      setAlertMessage(response.message);
    } else {
      setToggleAlert(true);
      setError(false);
      setAlertMessage("Success!");
      methods.setValue("name", "");
      methods.setValue("remarks", "");
      methods.setValue("isActive", true);
      methods.setValue("codes", []); // Reset the permissions (CheckboxGroup)
    }
  };

  return (
    <>
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="max-w-[500px] w-full">
          <h2 className="text-center font-semibold text-lg uppercase mb-5">
            Create Role
          </h2>
          <Form
            methods={methods}
            className="grid grid-cols-1  p-2 space-y-6"
            onSubmit={onSubmitForm}
          >
            <InputField name="name" type="text" label="Role" />
            <Checkbox name="isActive" label="Is Active" />
            <InputField name="remarks" type="text" label="Remark" />

            <CheckboxGroup />
            <CustomButton text="Create" type="submit" />
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
