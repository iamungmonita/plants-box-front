"use client";

import AutocompleteForm from "@/components/Autocomplete";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { RegisterSchema } from "@/schema/auth";
import { SignUp } from "@/services/authentication";
import { getRoles, getUserById, updateUserById } from "@/services/system";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "@/components/Upload";
import useFetch from "@/hooks/useFetch";
import AlertPopUp from "@/components/AlertPopUp";
import Checkbox from "@/components/Checkbox";
import { IAuthRegister } from "@/models/Auth";
import { useParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import BasicModal from "@/components/Modal";
import Password from "@/components/Modals/Password";

const Page = () => {
  const params = useParams();
  const [userId, setUserId] = useState<string>("");
  const [toggleModal, setToggleModal] = useState<boolean>(false);

  useEffect(() => {
    if (!params?.id) return;
    setUserId(params.id as string);
  }, [params]);

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

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: roles = [] } = useFetch(getRoles, {}, []);
  const [error, setError] = useState(false);
  const [toggleAlert, setToggleAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { profile } = useAuthContext();
  const onSubmitForm = async (data: IAuthRegister) => {
    try {
      const roleCodes =
        roles.find((role) => role._id === data.role)?.codes ?? [];

      const userData = {
        ...data,
        codes: roleCodes,
        pictures: (previewUrl ?? null) as any,
      };

      const response = userId
        ? await updateUserById(userId, userData)
        : await SignUp(userData);

      if (response.data) {
        setToggleAlert(true);
        setAlertMessage("Success!");
        setError(false);
      }

      if (!userId) {
        methods.setValue("firstName", "");
        methods.setValue("lastName", "");
        methods.setValue("role", "");
        methods.setValue("email", "");
        methods.setValue("password", "");
        methods.setValue("phoneNumber", "");
        methods.setValue("isActive", true);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      if (error) {
        setToggleAlert(true);
        setError(true);
        setAlertMessage(error.message);
        return;
      }
      setToggleAlert(true);
      setAlertMessage("Network error, please try again");
      setError(true);
      return;
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
            (role) => role._id === response.data?.role
          );
          if (selectedRole) {
            methods.setValue("role", selectedRole._id ?? "");
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
            setPreviewUrl(`${response.data?.pictures as unknown as string}`);
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
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(null);
    methods.setValue("pictures", "");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <BasicModal
        ContentComponent={Password}
        onClose={() => setToggleModal(false)}
        open={toggleModal}
        text={"Change Password"}
      />

      <AlertPopUp
        open={toggleAlert}
        error={error}
        message={alertMessage}
        onClose={() => setToggleAlert(false)}
      />
      <div className="max-w-[500px] w-full">
        <h2 className="text-center font-bold text-xl mb-5">
          {userId ? "Update" : "Create"} User
        </h2>
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
          {!userId && (
            <InputField name="password" type="password" label="Password" />
          )}
          {/* {profile?.codes.includes("1006") && ( */}
          <AutocompleteForm
            options={roles.map((option) => ({
              label: `${option.name}`,
              value: `${option._id}`,
            }))}
            name="role"
            label="Role"
          />
          {/* )} */}

          <Checkbox name="isActive" label="Active" />
          <ImageUpload
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            handleRemoveImage={handleRemoveImage}
          />
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`${
                userId === profile?._id ? "col-span-1" : "col-span-2"
              }`}
            >
              <CustomButton
                roleCodes={userId ? ["1011"] : ["1006"]}
                text={`${userId ? "Update" : "Create"}`}
                type="submit"
              />
            </div>
            {userId === profile?._id && (
              <CustomButton
                text="Change Password"
                onHandleButton={() => setToggleModal(true)}
              />
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Page;
