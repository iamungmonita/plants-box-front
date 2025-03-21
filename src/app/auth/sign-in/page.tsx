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

const Page = () => {
  const { signIn, onRefresh } = useAuthContext();
  const methods = useForm<IAuthLogIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LogInSchema),
  });
  const { setError } = methods;
  const router = useRouter();
  const [toggle, setToggle] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      } else if (response.name) {
        // Handle field-specific errors like email/password
        setError(response.name as "email" | "password", {
          type: "manual",
          message: response.message,
        });
      } else {
        // Handle general errors
        setErrorMessage(response.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[400px] w-full">
        <h2 className="text-center font-bold text-xl">Sign In</h2>

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
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </Form>
      </div>
    </div>
  );
};

export default Page;
