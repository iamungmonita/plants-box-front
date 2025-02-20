// page.tsx

"use client";

import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogInSchema } from "@/schema/auth";
import { Button } from "@mui/material";
import { IAuthLogIn } from "@/models/auth";
import { SignIn } from "@/services/authentication";

const Page = () => {
  const { signIn, onRefresh } = useAuthContext();
  const methods = useForm<IAuthLogIn>({ resolver: yupResolver(LogInSchema) });
  const { setError } = methods;
  const router = useRouter();

  const onSubmitForm = async (data: IAuthLogIn) => {
    const response = await SignIn(data);

    if ("admin" in response) {
      signIn();
      onRefresh();
      router.push("/admin/dashboard");
    } else {
      setError(response.name as "email" | "password", {
        type: "manual",
        message: response.message,
      });
      console.log(response.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[400px] w-full">
        <h2 className="text-center font-semibold text-lg uppercase">
          Log In Admin
        </h2>
        <Form
          methods={methods}
          className="grid grid-cols-1  p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <InputField name="email" type="email" label="Email" />
          <InputField name="password" type="password" label="Password" />
          <Button variant="contained" type="submit">
            Submit
          </Button>
          <Button href="/auth/sign-up" type="button">
            Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Page;
