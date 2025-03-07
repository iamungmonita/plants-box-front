"use client";

import CustomButton from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import API_URL from "@/lib/api";
import { RegisterSchema } from "@/schema/auth";
import { Response } from "@/schema/order";
import { SignUp } from "@/services/authentication";
import { CreateRole, RetrieveRoles } from "@/services/system";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldValue, FieldValues, useForm } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import AutocompleteForm from "@/components/Autocomplete";
export interface IRole extends FieldValues {
  name: string;
  codes: string[];
  remark: string;
  isActive: boolean;
}
export interface IRoleResponse extends IRole, Response {
  createdBy: string;
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
      codes: [],
      remarks: "",
      isActive: true,
    },
  });
  const { profile } = useAuthContext();
  const onSubmitForm = async (form: IRole) => {
    const newForm = {
      ...form,
      createdBy: profile?.firstName,
    };
    console.log(newForm);
    // const response = await CreateRole(newForm);
    // if (response.message) {
    //   console.log(response.message);
    // } else {
    //   console.log(response.data);
    //   setValue("name", "");
    //   setValue("code", 0);
    //   setValue("remarks", "");
    //   setValue("isActive", true);
    // }
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
          <Checkbox name="isActive" label="Is Active" />
          <InputField name="remarks" type="remarks" label="Remark" />

          <CheckboxGroup />
          <CustomButton text="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
