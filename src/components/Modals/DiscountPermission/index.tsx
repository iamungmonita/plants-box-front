"use client";

import React, { useEffect, useState } from "react";
import CustomButton from "@/components/Button";
import { getDiscountPermission } from "@/services/authentication";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { LogInSchema } from "@/schema/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { IAuthLogIn } from "@/models/Auth";
import { useAuthContext } from "@/context/AuthContext";
import AlertPopUp from "@/components/AlertPopUp";
import InputField from "@/components/InputText";
const DiscountPermission = ({
  onClose,

  text,
}: {
  onClose?: () => void;
  text?: string;
}) => {
  const { validation, isValidated } = useAuthContext();
  const [error, setError] = useState(false);
  const [toggleAlert, setToggleAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const methods = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(LogInSchema),
  });
  const onSubmitForm = async (data: IAuthLogIn) => {
    try {
      const response = await getDiscountPermission(data);
      if (response.data) {
        validation();
        setError(false);
        setAlertMessage("Success!");
        setToggleAlert(true);
      }
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      setError(true);
      setAlertMessage(error.message);
      setToggleAlert(true);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-3/4 gap-4">
      <AlertPopUp
        error={error}
        message={alertMessage}
        open={toggleAlert}
        onClose={() => setToggleAlert(false)}
      />
      <p className="text-2xl">{text}</p>
      <Form
        methods={methods}
        className="grid grid-cols-1 p-2 space-y-6"
        onSubmit={onSubmitForm}
      >
        <InputField name="email" type="email" label="Email" />
        <InputField name="password" type="password" label="Password" />
        <div className="grid grid-cols-2 gap-4">
          <CustomButton text="Confirm" type="submit" />
          <CustomButton text="Cancel" theme="alarm" onHandleButton={onClose} />
        </div>
      </Form>
    </div>
  );
};

export default DiscountPermission;
