"use client";

import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import API_URL from "@/lib/api";
import { RegisterSchema } from "@/schema/auth";
import { Response } from "@/schema/order";
import { SignUp } from "@/services/authentication";
import { CreateRole } from "@/services/system";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldValue, FieldValues, useForm } from "react-hook-form";

export interface IRole extends FieldValues {
  name: string;
  code: number;
  remark: string;
  isActive: boolean;
}
export interface IRoleResponse extends Response {
  name: string;
  code: number;
  remark: string;
  isActive: boolean;
}
export interface ILayout<T> {
  success: boolean;
  message?: string;
  data?: T;
  name?: string;
  errors?: any;
}

const Page = () => {
  const router = useRouter();
  const { signUp, onRefresh } = useAuthContext();

  const methods = useForm<IRole>({
    defaultValues: {
      name: "",
      code: 0,
      remarks: "",
      isActive: true,
    },
  });

  const { setValue } = methods;

  const onSubmitForm = async (form: IRole) => {
    const response = await CreateRole(form);
    if (response.message) {
      console.log(response.message);
    } else {
      console.log(response.data);
      setValue("name", "");
      setValue("code", 0);
      setValue("remarks", "");
      setValue("isActive", true);
    }
  };

  return (
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
          <InputField name="code" type="number" label="Code" />
          <InputField name="remarks" type="remarks" label="Remark" />
          <Checkbox name="isActive" />
          <CustomButton text="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
