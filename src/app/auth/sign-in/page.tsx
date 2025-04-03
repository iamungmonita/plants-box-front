"use client";

import Form from "@/components/Form";
import { CustomButton } from "@/components/Button";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogInSchema } from "@/schema/auth";
import { SignIn } from "@/services/authentication";
import BasicModal from "@/components/Modal";
import MoneyCounter from "@/components/Modals/MoneyCounter";
import { IAuthLogIn } from "@/models/Auth";
import AlertPopUp from "@/components/AlertPopUp";

const Page = () => {
  const router = useRouter();
  const { signIn, onRefresh } = useAuthContext();
  const [error, setError] = useState(false);
  const [toggleAlert, setToggleAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [toggle, setToggle] = useState<boolean>(false);

  const methods = useForm<IAuthLogIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LogInSchema),
  });

  const onSubmitForm = async (data: IAuthLogIn) => {
    try {
      const response = await SignIn(data);

      if (response.data) {
        if (response.data.token) {
          const authTokenKey =
            process.env.NEXT_PUBLIC_AUTH_TOKEN || "auth_token";
          localStorage.setItem(authTokenKey, response.data.token);
        } else {
          console.error("Token is missing in response data.");
        }

        signIn();
        onRefresh();
        if (response.data.initialLog) {
          setToggle(true);
        } else {
          setToggle(false);
          router.push("/admin/dashboard");
        }
      }
    } catch (error: any) {
      if (error) {
        setToggleAlert(true);
        setAlertMessage(error.message);
        setError(true);
        return;
      }
      setToggleAlert(true);
      setAlertMessage("Network error, please try again");
      setError(true);
      return;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[400px] w-full">
        <h2 className="text-center font-bold text-xl">Sign In</h2>
        <AlertPopUp
          open={toggleAlert}
          error={error}
          message={alertMessage}
          onClose={() => setToggleAlert(false)}
        />
        <BasicModal
          ContentComponent={MoneyCounter}
          open={toggle}
          onClose={() => setToggle(false)}
        />
        <Form
          methods={methods}
          className="grid grid-cols-1 p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <InputField name="email" type="email" label="Email" />
          <InputField name="password" type="password" label="Password" />
          <CustomButton text="Submit" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
