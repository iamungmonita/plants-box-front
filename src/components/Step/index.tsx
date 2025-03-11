import * as React from "react";
import Box from "@mui/material/Box";
import OrderPanel from "../OrderList";
import InputField from "../InputText";
import Form from "../Form";
import { useForm } from "react-hook-form";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { formattedKHR } from "@/helpers/format/currency";
import { useState, useEffect } from "react";

export interface Step {
  step: string;
  totalAmount: number;
  onPaymentChange: (usd: number, khr: number) => void;
}

export default function HorizontalLinearStepper({
  step,
  totalAmount,
  onPaymentChange,
}: Step) {
  const exchangeRate = useExchangeRate();
  const [activeStep, setActiveStep] = useState(0);
  const [changeToKHR, setChangeKHR] = useState("");

  const methods = useForm({
    defaultValues: {
      usd: "",
      khr: "",
      change: "",
    },
  });

  const { watch } = methods;
  const { usd, khr, change } = watch();

  useEffect(() => {
    if (step === "cash") {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [step]);

  useEffect(() => {
    convertChangeToKHR();
  }, [change, exchangeRate]);

  const returnAmount = () => {
    const dollar = parseFloat(usd) || 0;
    const riel = parseFloat(khr) || 0;
    const total = dollar + riel / exchangeRate;
    const returnChanges = Math.max(total - totalAmount, 0);
    return { total, returnChanges };
  };

  useEffect(() => {
    const { total, returnChanges } = returnAmount();
    onPaymentChange(total, returnChanges);
  }, [usd, khr, onPaymentChange]);

  const convertChangeToKHR = () => {
    const dollar = parseFloat(change) || 0;
    const { returnChanges } = returnAmount();
    const remaining = dollar - returnChanges;

    if (remaining >= 0) {
      setChangeKHR("");
      return;
    }

    setChangeKHR(`៛${formattedKHR(Math.abs(remaining * exchangeRate))}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {activeStep === 1 ? (
        <div className="flex flex-col gap-10 w-full">
          <hr />
          <div>
            <Form methods={methods} className="space-y-10">
              <div className="flex flex-col gap-4 items-start justify-between">
                <h2 className="text-xl">Total Payment</h2>
                <div className="grid grid-cols-7 items-center justify-between gap-4 w-full">
                  <input
                    className="text-2xl col-span-3 p-2 rounded bg-gray-100"
                    value={`$${totalAmount.toFixed(2)}`}
                    readOnly
                  />
                  <h2 className="col-span-1 text-2xl text-center"> = </h2>
                  <input
                    className="text-2xl col-span-3 p-2 rounded bg-gray-100"
                    value={`៛${formattedKHR(totalAmount * exchangeRate)}`}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 items-start justify-between">
                <h2 className="text-xl">Received Amount</h2>
                <div className="grid grid-cols-2 items-center justify-between gap-4 w-full">
                  <InputField type="text" label="US Dollar" name="usd" />
                  <InputField type="text" label="Cambodian Riel" name="khr" />
                </div>
              </div>
              <div className="flex flex-col gap-4 items-start justify-between">
                <h2 className="text-xl">
                  Return Amount:
                  <span>{`$${returnAmount().returnChanges?.toFixed(2)}`}</span>
                </h2>
                <div className="grid grid-cols-2 items-center justify-between gap-4 w-full">
                  <InputField type="text" label="US Dollar" name="change" />
                  <input
                    className="text-2xl p-2 rounded bg-gray-100"
                    value={`${changeToKHR || ""}`}
                    readOnly
                  />
                </div>
              </div>
            </Form>
          </div>
          <hr />
        </div>
      ) : (
        <OrderPanel />
      )}
    </Box>
  );
}
