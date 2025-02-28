"use client";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { MdCurrencyExchange } from "react-icons/md";
import { ExchangeRate } from "@/components/Modals/ExchangeRate";
import { formattedTimeStamp } from "@/helpers/format/time";
import { getTotalAmountToday } from "@/services/order";

const page = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<number>(0);
  const { isAuthenticated, signOut, profile } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
    const fetch = async () => {
      const response = await getTotalAmountToday();
      if (response.data) {
        setAmount(response.data.amount);
        setTransactions(response.data.count);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      {isAuthenticated && (
        <div>
          <h2 className="text-xl font-semibold">
            Welcome back, {profile?.firstname}
          </h2>
          <p>
            Today, we have earned ${amount.toFixed(2)} so far on {transactions}{" "}
            transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default page;
