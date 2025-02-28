import { useAuthContext } from "@/context/AuthContext";
import { ILog, InitialLog } from "@/services/log";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import Form from "@/components/Form";
import CustomButton from "@/components/Button";
import AlertPopUp from "@/components/AlertPopUp";
import { formattedKHR } from "@/helpers/format/currency";
import { CloseSharp } from "@mui/icons-material";
import { MdClose } from "react-icons/md";
export interface ExchangeRate {
  rate: string;
}
export const ExchangeRate = ({
  onCloseModal,
}: {
  onCloseModal: () => void;
}) => {
  const methods = useForm<ExchangeRate>({
    defaultValues: {
      rate: "",
    },
  });
  const { setValue, watch } = methods;
  const rate = watch("rate");
  const { isAuthorized } = useAuthContext();
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const onSubmitForm = ({ rate }: ExchangeRate) => {
    localStorage.setItem("exchange-rate", rate);
    window.dispatchEvent(new Event("exchangeRateUpdated"));
    setValue("rate", rate);
    setToggle(true);
    setValue("rate", "");
  };

  // if (!isAuthorized(["seller"])) {
  //   return <div>You do not have permission to change exchange rate.</div>;
  // }
  const handleExchangeRate = () => {
    const rate = localStorage.getItem("exchange-rate");
    setExchangeRate(rate ? rate : (prev) => prev);
  };

  useEffect(() => {
    handleExchangeRate();
    window.addEventListener("exchangeRateUpdated", handleExchangeRate);
    return () =>
      window.removeEventListener("exchangeRateUpdated", handleExchangeRate);
  }, []);
  const [toggle, setToggle] = useState(false);
  const handleCloseAlert = () => {
    setToggle(false);
  };
  return (
    <Form methods={methods} onSubmit={onSubmitForm} className="space-y-4 w-3/4">
      {/* <MdClose
        onClick={onCloseModal}
        className="float-right w-7 h-7 bg-slate-100 shadow p-1 hover:cursor-pointer"
      /> */}

      <p className="text-lg">
        Your exchange rate is now ៛{formattedKHR(parseFloat(exchangeRate))}.
      </p>
      <InputField label="Exchange rate" type="string" name="rate" />
      <CustomButton
        type="submit"
        text="Change"
        disabled={rate === ""}
        theme={`${rate === "" && "dark"}`}
      />
      <AlertPopUp
        open={toggle}
        onClose={handleCloseAlert}
        message={`Your exchange rate has been successfully changed to ៛${formattedKHR(
          parseFloat(exchangeRate)
        )}`}
      />
    </Form>
  );
};

export default ExchangeRate;
