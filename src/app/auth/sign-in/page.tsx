"use client";

import Form from "@/components/Form";
import { CustomButton } from "@/components/Button";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogInSchema } from "@/schema/auth";
import { Button, CircularProgress } from "@mui/material";
import { IAuthLogIn } from "@/models/auth";
import { getAdminProfile, SignIn } from "@/services/authentication";
import BasicModal from "@/components/Modal";
import { createLog, countLog } from "@/services/log";
import MoneyCounter from "@/components/Modals/MoneyCounter";

const Page = () => {
  const { signIn, onRefresh, profile, isAuthenticated } = useAuthContext();
  const methods = useForm<IAuthLogIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LogInSchema),
  });
  const { setError } = methods;
  const router = useRouter();

  const [toggle, setToggle] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(true); // New loading state

  // useEffect(() => {
  //   // Check if the user is already authenticated
  //   if (isAuthenticated) {
  //     router.push("/admin/dashboard");
  //     return;
  //   }
  //   setLoading(false); // Set loading to false when the auth status is checked
  // }, [isAuthenticated, router]);

  const onSubmitForm = async (data: IAuthLogIn) => {
    const response = await SignIn(data);

    if (response.data) {
      signIn();
      onRefresh();
      const firstLog = await countLog({
        userId: response.data._id,
      });
      console.log(!firstLog);
      if (firstLog) {
        setToggle(true);
      } else {
        setToggle(false);
      }
      router.push("/admin/dashboard");
    } else {
      setError(response.name as "email" | "password", {
        type: "manual",
        message: response.message,
      });
      console.log(response.message);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, []);
  // if (loading) {
  //   return (
  //     <div>
  //       <CircularProgress size="30px" />
  //     </div>
  //   ); // Optionally show a loading spinner or animation
  // }
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[400px] w-full">
        <h2 className="text-center font-bold text-xl">Sign In</h2>

        <BasicModal
          content={<MoneyCounter />}
          open={toggle}
          // onClose={() => setToggle(false)}
        />
        <Form
          methods={methods}
          className="grid grid-cols-1 p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <InputField name="email" type="email" label="Email" />
          <InputField name="password" type="password" label="Password" />
          <CustomButton text="Submit" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Page;
