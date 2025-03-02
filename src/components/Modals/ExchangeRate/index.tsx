import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import Form from "@/components/Form";
import CustomButton from "@/components/Button";
import AlertPopUp from "@/components/AlertPopUp";
import { formattedKHR } from "@/helpers/format/currency";
import { useExchangeRate } from "@/hooks/useExchangeRate";

export interface ExchangeRate {
  rate: string;
}
export const ExchangeRate = () => {
  const exchangeRate = useExchangeRate();
  const [toggle, setToggle] = useState(false);

  const methods = useForm<ExchangeRate>({
    defaultValues: {
      rate: "",
    },
  });
  const { setValue, watch } = methods;
  const rate = watch("rate");
  const onSubmitForm = ({ rate }: ExchangeRate) => {
    localStorage.setItem("exchange-rate", rate);
    window.dispatchEvent(new Event("exchangeRateUpdated"));
    setToggle(true);
    setValue("rate", "");
  };

  const handleCloseAlert = () => {
    setToggle(false);
  };
  // const { isAuthorized } = useAuthContext();

  return (
    <Form methods={methods} onSubmit={onSubmitForm} className="space-y-4 w-3/4">
      <p className="text-lg">
        Your exchange rate is now ៛{formattedKHR(exchangeRate)}.
      </p>
      <InputField label="Exchange rate" type="text" name="rate" />
      <CustomButton
        type="submit"
        text="Change"
        disabled={rate === ""}
        theme={`${rate === "" && "dark"}`}
      />
      <AlertPopUp
        open={toggle}
        onClose={handleCloseAlert}
        message={`Exchange rate has been changed to ៛${formattedKHR(
          exchangeRate
        )}.`}
      />
    </Form>
  );
};

export default ExchangeRate;
