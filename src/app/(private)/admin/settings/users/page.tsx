"use client";

import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import API_URL from "@/lib/api";
import { RegisterSchema } from "@/schema/auth";
import { SignUp } from "@/services/authentication";
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
  const router = useRouter();
  const { signUp, onRefresh } = useAuthContext();

  const methods = useForm<IAuthRegister>({
    resolver: yupResolver(RegisterSchema),
  });

  const { setError } = methods;

  const onSubmitForm = async (data: IAuthRegister) => {
    const response = await SignUp(data);
    if ("admin" in response) {
      signUp();
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
      <div className="max-w-[500px] w-full">
        <h2 className="text-center font-semibold text-lg uppercase mb-5">
          Create User
        </h2>
        <Form
          methods={methods}
          className="grid grid-cols-1  p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="profile.firstname"
              type="text"
              label="First Name"
            />
            <InputField name="profile.lastname" type="text" label="Last Name" />
          </div>
          <InputField name="email" type="email" label="Email" />
          <InputField name="phone-number" type="email" label="Phone Number" />
          <InputField name="password" type="password" label="Password" />
          <InputField name="role" type="role" label="Role" />
          <Button variant="contained" type="submit">
            Create
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
