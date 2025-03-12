"use client";

import Form from "@/components/Form";
import { CustomButton } from "@/components/Button";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogInSchema } from "@/schema/auth";
import { SignIn } from "@/services/authentication";
import BasicModal from "@/components/Modal";
import MoneyCounter from "@/components/Modals/MoneyCounter";
import { IAuthLogIn } from "@/models/Auth";

const Page = () => {
  const { signIn, onRefresh } = useAuthContext();
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

  const onSubmitForm = async (data: IAuthLogIn) => {
    const response = await SignIn(data);

    if (response.data) {
      signIn();
      onRefresh();
      if (response.data.count) {
        setToggle(true);
      } else {
        setToggle(false);
        router.push("/admin/dashboard");
      }
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
      <div className="max-w-[400px] w-full">
        <h2 className="text-center font-bold text-xl">Sign In</h2>

        <BasicModal
          ContentComponent={MoneyCounter}
          open={toggle}
          onClose={() => setToggle(false)}
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
