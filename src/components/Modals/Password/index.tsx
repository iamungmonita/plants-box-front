"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import AutocompleteForm from "@/components/Autocomplete";
import BasicModal from "@/components/Modal";
import CreateForm from "@/components/Form/Membership";
import { updateUserPasswordById } from "@/services/system";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AlertPopUp from "@/components/AlertPopUp";
import InputField from "@/components/InputText";

const Password = ({ onClose }: { onClose?: () => void }) => {
  const [toggleAlert, setToggleAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const { profile, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const methods = useForm({ defaultValues: { password: "" } });
  const newPassword = methods.watch("password");

  const handleClose = () => {
    setToggle(false);
    if (onClose) {
      onClose();
    }
  };

  const onSubmitForm = async () => {
    try {
      if (!profile) {
        router.push("/auth/sign-in");
      } else {
        const userId = profile?._id;
        const response = await updateUserPasswordById(userId, {
          password: newPassword,
        });
        if (response.data) {
          setToggleAlert(true);
          setAlertMessage("Success!");
        }
      }
    } catch (error: any) {
      if (error.message) {
        setToggleAlert(true);
        setError(true);
        setAlertMessage(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full gap-4">
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <Form
        methods={methods}
        onSubmit={onSubmitForm}
        className="w-full gap-4 grid justify-end grid-cols-4"
      >
        <div className="col-span-4">
          <InputField name="password" label="New Password" type="password" />
        </div>
        <div className="col-span-2">
          <CustomButton
            text="change"
            disabled={newPassword === ""}
            theme={newPassword === "" ? "dark" : ""}
            type="submit"
          />
        </div>
        <div className="col-span-2">
          <CustomButton
            text="close"
            theme="alarm"
            onHandleButton={handleClose}
          />
        </div>
      </Form>
    </div>
  );
};

export default Password;
