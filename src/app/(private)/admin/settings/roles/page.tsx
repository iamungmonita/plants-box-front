"use client";

import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import API_URL from "@/lib/api";
import { RegisterSchema } from "@/schema/auth";
import { SignUp } from "@/services/authentication";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldValue, FieldValues, useForm } from "react-hook-form";

export interface IPermission extends FieldValues {
  permission: string;
  code: number;
  remark: string;
  isActive: boolean;
}

const Page = () => {
  const router = useRouter();
  const { signUp, onRefresh } = useAuthContext();

  const methods = useForm<IPermission>({
    defaultValues: {
      permission: "",
      code: 0,
      remark: "",
      isActive: true,
    },
  });

  const { setError } = methods;

  const onSubmitForm = async (data: IPermission) => {
    console.log(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[500px] w-full">
        <h2 className="text-center font-semibold text-lg uppercase mb-5">
          Create Permission
        </h2>
        <Form
          methods={methods}
          className="grid grid-cols-1  p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <InputField name="permission" type="text" label="Permission" />
          <InputField name="code" type="number" label="Code" />
          <InputField name="remark" type="remark" label="Remark" />
          <FormControlLabel
            sx={{
              "& .MuiInputBase-input": { fontFamily: "var(--text)" },
              "& .MuiInputLabel-root": { fontFamily: "var(--text)" },
              "& .MuiFormHelperText-root": { fontFamily: "var(--text)" },
            }}
            control={
              <Checkbox
                {...methods.register("isActive")} // Register the checkbox with React Hook Form
                color="primary"
              />
            }
            label={"Is Active"}
          />
          <Button variant="contained" type="submit">
            Create
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Page;
