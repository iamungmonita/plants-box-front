"use client";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { MdCurrencyExchange } from "react-icons/md";

const page = () => {
  const router = useRouter();
  const [exchangeRate, setExchangeRate] = useState(4100);
  const { isAuthenticated, signOut, profile } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, []);
  const methods = useForm<{ rate: string }>({
    defaultValues: {
      rate: "",
    },
  });
  const { setValue } = methods;

  const onHandleChangeRate = ({ rate }: { rate: string }) => {
    localStorage.setItem("exchange-rate", rate);
    window.dispatchEvent(new Event("exchangeRateUpdated"));
    setValue("rate", "");
  };

  const onSubmitSignOut = () => {
    signOut();
    router.push("/auth/sign-in");
  };
  console.log(profile);
  return (
    <div>
      {isAuthenticated && (
        <div>
          <Form methods={methods} onSubmit={onHandleChangeRate}>
            <InputField label="Exchange rate" type="string" name="rate" />
            <Button
              type="submit"
              variant="outlined"
              sx={{ backgroundColor: "var(--medium-light)", color: "white" }}
            >
              Change
            </Button>
          </Form>
          <h2>Welcome back.</h2>
          <p>today exchange rate is {exchangeRate}</p>
          <p>{profile?.username}</p>
          <p>{profile?.email}</p>
          <button onClick={onSubmitSignOut}>sign out</button>
        </div>
      )}
    </div>
  );
};

export default page;
