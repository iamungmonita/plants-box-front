"use client";

import { IAuthRegister } from "@/app/(private)/admin/settings/users/create/page";
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

const Page = () => {
  const router = useRouter();
  const { signUp, onRefresh } = useAuthContext();

  const methods = useForm<IAuthRegister>({
    resolver: yupResolver(RegisterSchema),
  });

  const { setError } = methods;

  const onSubmitForm = async (data: IAuthRegister) => {
    console.log(data);
    // const response = await SignUp(data);
    // if (response.message) {
    //   console.log(response.message);
    // }
    // if (response.data) {
    //   signUp();
    //   onRefresh();
    //   router.push("/admin/dashboard");
    // } else {
    //   console.log(response.message);
    // }
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
          <InputField name="phonenumber" type="text" label="Phone Number" />
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
