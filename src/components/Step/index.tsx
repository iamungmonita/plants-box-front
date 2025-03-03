import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import OrderPanel from "../OrderList";
import { ChevronLeft } from "@mui/icons-material";
import InputField from "../InputText";
import Form from "../Form";
import { useForm } from "react-hook-form";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { formattedKHR } from "@/helpers/format/currency";

const steps = ["Step 1", "Step 2"]; // Only 2 steps

export default function HorizontalLinearStepper({
  step,
  totalAmount,
}: {
  step: string;
  totalAmount: number;
}) {
  const exchangeRate = useExchangeRate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [changeToKHR, setChangeKHR] = React.useState("");

  // Trigger the step update only based on `step` change, not `activeStep`
  React.useEffect(() => {
    if (step === "cash") {
      setActiveStep(1); // When `step` is "cash", move to the second step
    } else {
      setActiveStep(0); // Otherwise, set it back to the first step
    }
  }, [step]); // Only depend on `step`, not `activeStep`

  const methods = useForm({
    defaultValues: {
      usd: "",
      khr: "",
      change: "",
    },
  });
  const { watch } = methods;
  const usd = watch("usd");
  const khr = watch("khr");
  const change = watch("change");
  const returnAmount = () => {
    const dollar = parseFloat(usd);
    if (isNaN(dollar)) {
      return 0;
    }
    const riel = parseFloat(khr) || 0;

    if (isNaN(riel)) {
      return 0;
    }
    const total = dollar + riel / exchangeRate;
    if (isNaN(total)) {
      return 0;
    }
    const amount = total - totalAmount;
    if (isNaN(amount)) {
      return 0;
    }
    if (amount < 0) {
      return 0;
    }
    return amount;
  };
  const convertChangeToKHR = () => {
    const dollar = parseFloat(change);
    if (isNaN(dollar)) {
      setChangeKHR("");
      return;
    }
    if (isNaN(returnAmount())) {
      setChangeKHR("");
      return;
    }
    const calculation = dollar - returnAmount();
    const convert = calculation * exchangeRate;

    if (isNaN(convert)) {
      setChangeKHR("");
      return;
    }
    if (convert > 0) {
      setChangeKHR("");
      return;
    }
    setChangeKHR(`៛${formattedKHR(Math.abs(convert))}`);
  };
  React.useEffect(() => {
    convertChangeToKHR();
  }, [change, exchangeRate]);

  return (
    <Box
      sx={{
        marginTop: `${step === "cash" ? "100px" : 0}`,
        width: "100%",
      }}
    >
      {activeStep === 1 ? (
        <div className="flex flex-col gap-10 w-full">
          {/* <h2 className="text-xl text-center font-bold">Cash Payment</h2> */}

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
                  <InputField type="text" label="dollar" name="usd" />
                  <InputField type="text" label="riel" name="khr" />
                </div>
              </div>
              <div className="flex flex-col gap-4 items-start justify-between">
                <h2 className="text-xl">
                  Return Amount: <span>{`$${returnAmount().toFixed(2)}`}</span>
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
        </div>
      ) : (
        <OrderPanel />
      )}
    </Box>
  );
}
