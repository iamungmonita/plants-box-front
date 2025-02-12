"use client";

import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import { RegisterSchema } from "@/schema/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export interface IAuthRegister {
  username: string;
  email: string;
  password: string;
}

const Page = () => {
  const methods = useForm<IAuthRegister>({
    resolver: yupResolver(RegisterSchema),
  });
  const { setError } = methods;
  const router = useRouter();
  const { signUp } = useAuthContext();
  const onSubmitForm = async (data: IAuthRegister) => {
    const response = await fetch("http://localhost:4002/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      signUp();
      router.push("/admin/dashboard");
    } else if (result.name && result.message) {
      setError(result.name, { type: "manual", message: result.message });
    } else {
      console.error(result.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[400px] w-full">
        <h2 className="text-center font-semibold text-lg uppercase">
          Create Admin
        </h2>
        <Form
          methods={methods}
          className="grid grid-cols-1  p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <InputField name="username" type="text" label="Username" />
          <InputField name="email" type="email" label="Email" />
          <InputField name="password" type="password" label="Password" />
          <Button variant="contained" type="submit">
            Submit
          </Button>
          <Button href="/auth/sign-in" type="button">
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Page;
