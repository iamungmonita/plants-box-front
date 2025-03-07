"use client";

import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import API_URL from "@/lib/api";
import { IAuthRegister, RegisterSchema } from "@/schema/auth";
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
import ImageUpload from "@/components/Upload";
import { convertFileToBase64 } from "@/helpers/format/picture";
import useFetch from "@/hooks/useFetch";

const Page = () => {
  const router = useRouter();
  const { profile, isAuthorized } = useAuthContext();
  const authorized = isAuthorized();
  console.log(authorized);
  const methods = useForm<IAuthRegister>({
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(RegisterSchema),
  });
  // const [roles, setRoles] = useState<string[]>([]);
  const {
    formState: { errors },
  } = methods;
  console.log(errors);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: roles = [] } = useFetch(RetrieveRoles, {}, []);

  const onSubmitForm = async (data: IAuthRegister) => {
    try {
      let fileBase64 = ""; // Default to existing image
      if (file instanceof File) {
        fileBase64 = await convertFileToBase64(file);
      }

      const roleArray = Array.isArray(data.role) ? data.role : [data.role];

      const userData = {
        ...data,
        codes: roleArray,
        createdBy: profile?.firstName,
        pictures: fileBase64 || data.pictures, // Ensure the correct image is sent
      };
      console.log(userData);
      const response = await SignUp(userData);
      if (response.data) {
        console.log(response.data);
      }
      // if (response.success) {
      //   setToggleAlert(true);
      //   setAlertMessage("Success!");
      // } else {
      //   setToggleAlert(false);
      //   setAlertMessage(`Error: ${response.message}`);
      // }
      // if (!createId) {
      //   setValue("name", "");
      //   setValue("category", "");
      //   setValue("price", 0);
      //   setValue("importedPrice", 0);
      //   setValue("barcode", "");
      //   setValue("stock", 0);
      //   setValue("isActive", true);
      //   setValue("isDiscountable", true);
      //   setValue("pictures", null as any);
      //   setFile(null);
      //   setPreviewUrl(null);
      // } else if (fileBase64) {
      //   // If updating, update preview with new image
      //   setPreviewUrl(fileBase64);
      // }
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       const response = await RetrieveRoles();
  //       setRoles(response.data?.map((role: IRoleResponse) => role.name) ?? []);
  //     } catch (error) {
  //       console.error("Error uploading:", error);
  //     }
  //   };
  //   fetchRoles();
  // }, []);
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();

    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[500px] w-full">
        <h2 className="text-center font-bold text-xl mb-5">Create User</h2>
        <Form
          methods={methods}
          className="p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <div className="grid grid-cols-2 col-span-1 gap-4">
            <InputField name="firstName" type="text" label="First Name" />
            <InputField name="lastName" type="text" label="Last Name" />
          </div>
          <InputField name="email" type="email" label="Email" />
          <InputField name="phoneNumber" type="text" label="Phone Number" />
          <InputField name="password" type="password" label="Password" />
          <ImageUpload
            previewUrl={previewUrl}
            setFile={setFile}
            setPreviewUrl={setPreviewUrl}
            handleRemoveImage={handleRemoveImage}
          />
          <AutocompleteForm
            options={roles.map((option) => ({
              label: `${option.name}`,
              value: `${option.codes}`,
            }))}
            name="role"
            label="Role"
          />
          <CustomButton text="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
