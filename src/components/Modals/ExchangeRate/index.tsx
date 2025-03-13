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
export const ExchangeRate = ({ onClose }: { onClose?: () => void }) => {
  const exchangeRate = useExchangeRate();
  const [toggleAlert, setToggleAlert] = useState(false);

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
    setToggleAlert(true);
    setValue("rate", "");
  };

  const handleCloseAlert = () => {
    setToggleAlert(false);
  };

  return (
    <Form methods={methods} onSubmit={onSubmitForm} className="space-y-4 w-3/4">
      <p className="text-lg">
        Your exchange rate is now ៛{formattedKHR(exchangeRate)}.
      </p>
      <InputField label="Exchange rate" type="text" name="rate" />
      <div className="grid grid-cols-2 gap-4">
        <CustomButton
          type="submit"
          text="Change"
          disabled={rate === ""}
          theme={`${rate === "" && "dark"}`}
        />
        <CustomButton onHandleButton={onClose} text="Close" theme="alarm" />
      </div>

      <AlertPopUp
        open={toggleAlert}
        onClose={handleCloseAlert}
        message={`Exchange rate has been changed to ៛${formattedKHR(
          exchangeRate
        )}.`}
      />
    </Form>
  );
};

export default ExchangeRate;
