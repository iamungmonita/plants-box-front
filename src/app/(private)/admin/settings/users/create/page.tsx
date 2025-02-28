"use client";

import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import API_URL from "@/lib/api";
import { RegisterSchema } from "@/schema/auth";
import { SignUp } from "@/services/authentication";
import { RetrieveRoles } from "@/services/system";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { IRoleResponse } from "../../roles/create/page";
import { Response } from "@/schema/order";

export interface IAuthRegister extends FieldValues {
  firstname: string;
  lastname: string;
  phonenumber: string;
  email: string;
  role: string;
  password: string;
}
export interface IAuthRegisterResponse extends Response {
  firstname: string;
  lastname: string;
  phonenumber: string;
  email: string;
  role: string;
  password: string;
}

const Page = () => {
  const router = useRouter();
  const { signUp, onRefresh } = useAuthContext();

  const methods = useForm<IAuthRegister>({
    defaultValues: {
      role: "",
      firstname: "",
      lastname: "",
      phonenumber: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(RegisterSchema),
  });
  const [roles, setRoles] = useState<string[]>([]);
  const { setError } = methods;

  const onSubmitForm = async (data: IAuthRegister) => {
    console.log(data);
    const response = await SignUp(data);
    if (response.message) {
      console.log(response.message);
    }
    if (response.data) {
      console.log(data);
    } else {
      console.log(response.message);
    }
  };
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RetrieveRoles();
        setRoles(response.data?.map((role: IRoleResponse) => role.name) ?? []);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    };
    fetchRoles();
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[500px] w-full">
        <h2 className="text-center font-bold text-xl mb-5">Create User</h2>
        <Form
          methods={methods}
          className="grid grid-cols-1  p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <div className="grid grid-cols-2 gap-4">
            <InputField name="firstname" type="text" label="First Name" />
            <InputField name="lastname" type="text" label="Last Name" />
          </div>
          <InputField name="email" type="email" label="Email" />
          <InputField name="phonenumber" type="text" label="Phone Number" />
          <InputField name="password" type="password" label="Password" />
          <AutocompleteForm options={roles} name="role" label="Role" />
          <CustomButton text="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
