"use client";

import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import { RegisterSchema } from "@/schema/auth";
import { SignUp } from "@/services/authentication";
import { getRoles, getUserById, updateUserById } from "@/services/system";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "@/components/Upload";
import { convertFileToBase64 } from "@/helpers/format/picture";
import useFetch from "@/hooks/useFetch";
import AlertPopUp from "@/components/AlertPopUp";
import Checkbox from "@/components/Checkbox";
import { IAuthRegister } from "@/models/Auth";
import API_URL from "@/lib/api";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (!params?.id) return;
    setUserId(params.id as string);
  }, [params]);

  const { profile } = useAuthContext();
  const methods = useForm<IAuthRegister>({
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      isActive: true,
      password: "",
    },
    resolver: yupResolver(RegisterSchema),
  });

  const {
    formState: { errors },
  } = methods;
  console.log(errors);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: roles = [] } = useFetch(getRoles, {}, []);
  const [error, setError] = useState(false);
  const [toggleAlert, setToggleAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSubmitForm = async (data: IAuthRegister) => {
    try {
      let fileBase64 = ""; // Default to existing image
      if (file instanceof File) {
        fileBase64 = await convertFileToBase64(file);
      }
      const roleCodes =
        roles.find((role) => role.name === data.role)?.codes ?? [];

      const userData = {
        ...data,
        codes: roleCodes,
        createdBy: profile?.firstName,
        pictures: fileBase64 || data.pictures, // Ensure the correct image is sent
      };
      const response = userId
        ? await updateUserById(userId, userData)
        : await SignUp(userData);

      if (response.message) {
        setToggleAlert(true);
        setAlertMessage(response.message);
        setError(true);
        return;
      }

      setToggleAlert(true);
      setAlertMessage("Success!");
      setError(false);

      if (!userId) {
        methods.setValue("firstName", "");
        methods.setValue("lastName", "");
        methods.setValue("role", "");
        methods.setValue("email", "");
        methods.setValue("password", "");
        methods.setValue("phoneNumber", "");
        methods.setValue("isActive", true);
        setPreviewUrl(null);
        setFile(null);
      } else if (fileBase64) {
        setPreviewUrl(fileBase64);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const response = await getUserById(userId);
        if (response.data) {
          methods.setValue("firstName", response.data?.firstName);
          methods.setValue("lastName", response.data?.lastName);
          const selectedRole = roles.find(
            (role) => role.name === response.data?.role
          );
          if (selectedRole) {
            methods.setValue("role", selectedRole.name ?? "");
          }
          methods.setValue("email", response.data?.email);
          methods.setValue("password", response.data?.password);
          methods.setValue("phoneNumber", response.data?.phoneNumber);
          methods.setValue("isActive", true);
          if (response.data?.pictures) {
            methods.setValue(
              "pictures",
              response.data?.pictures as unknown as string
            );
            setPreviewUrl(
              `${API_URL}${response.data?.pictures as unknown as string}`
            );
          } else {
            methods.setValue("pictures", "");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchUser();
  }, [userId, roles]);
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
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
          <AutocompleteForm
            options={roles.map((option) => ({
              label: `${option.name}`,
              value: `${option.name}`,
            }))}
            name="role"
            label="Role"
          />
          <Checkbox name="isActive" label="Active" />
          <ImageUpload
            previewUrl={previewUrl}
            setFile={setFile}
            setPreviewUrl={setPreviewUrl}
            handleRemoveImage={handleRemoveImage}
          />

          <CustomButton text="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
