import { useAuthContext } from "@/context/AuthContext";
import { ILog, InitialLog } from "@/services/log";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import Form from "@/components/Form";
import CustomButton from "@/components/Button";
import {
  generateDefaultValues,
  getKhrMultiplier,
  getUsdMultiplier,
  khrFields,
  usdFields,
} from "@/constants/MoneyCounter";

export const MoneyCounter = () => {
  const methods = useForm<ILog>({
    defaultValues: {
      usd: "",
      khr: "",
      ...generateDefaultValues(usdFields),
      ...generateDefaultValues(khrFields),
    },
  });

  const { watch, setError, clearErrors } = methods;
  const { profile } = useAuthContext();
  const [canProceed, setCanProceed] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const router = useRouter();

  const collectFields = (fields: readonly string[]) => {
    return fields.reduce((acc, field) => {
      acc[field] = watch(field);
      return acc;
    }, {} as Record<string, number>);
  };

  const usd = Number(watch("usd")) || 0;
  const khr = Number(watch("khr")) || 0;
  const riels = collectFields(khrFields);
  const dollars = collectFields(usdFields);

  const handleModalClose = () => {
    router.push("/admin/dashboard");
  };

  useEffect(() => {
    if (usd !== 0 || khr !== 0) {
      setHasUserInteracted(true);
    }

    if (hasUserInteracted) {
      if (!khr && !usd) {
        setError("usd", {
          type: "manual",
          message: "Either USD or KHR must be filled",
        });

        setError("khr", {
          type: "manual",
          message: "Either USD or KHR must be filled",
        });
        setCanProceed(false); // Disable button if no input
        return;
      } else {
        clearErrors("usd");
        clearErrors("khr");
      }

      validateBills(); // Continue with bills validation if user interacted
    }
  }, [
    watch("usd"),
    watch("khr"),
    ...usdFields.map((field) => watch(field)),
    ...khrFields.map((field) => watch(field)),
    hasUserInteracted, // Depend on this state
  ]);

  const validateBills = () => {
    const usdTotal = usdFields.reduce(
      (acc, field) =>
        acc + (Number(watch(field)) || 0) * getUsdMultiplier(field),
      0
    );

    const khrTotal = khrFields.reduce(
      (acc, field) =>
        acc + (Number(watch(field)) || 0) * getKhrMultiplier(field),
      0
    );

    if (khr > 0 && khr < 100) {
      setError("khr", {
        type: "manual",
        message: "Cambodian riels cannot be less than 100",
      });
      setCanProceed(false);
      return;
    } else {
      clearErrors("khr");
    }

    if (usdTotal === usd && khrTotal === khr) {
      setCanProceed(true);
      clearErrors("usd");
      clearErrors("khr");
    } else {
      setCanProceed(false);
      if (usdTotal !== usd) {
        setError("usd", {
          type: "manual",
          message: "Select USD bills to match the amount.",
        });
      } else {
        clearErrors("usd");
      }

      if (khrTotal !== khr) {
        setError("khr", {
          type: "manual",
          message: "Select Cambodian riel bills to match the amount.",
        });
      } else {
        clearErrors("khr");
      }
    }
  };

  const onSubmitForm = async (data: ILog) => {
    data = {
      usd,
      khr,
      counter: profile?.firstname as string,
      riels,
      dollars,
    };

    try {
      const response = await InitialLog(data);
      if (response.data) {
        handleModalClose();
      }
    } catch (error) {
      console.error("Request failed:", error);
      setCanProceed(false);
    }
  };

  return (
    <Form
      methods={methods}
      onSubmit={onSubmitForm}
      className="w-3/4 mx-auto space-y-10"
    >
      <h2 className="text-xl font-bold flex flex-col">
        <span>Good Morning, {profile?.firstname}.</span>
        <span className="text-lg font-normal text-gray-500">
          Please count the money left in the drawer.
        </span>
      </h2>

      <div className="flex gap-4">
        <InputField
          label="US Dollar"
          type="text"
          placeholder="$..."
          name="usd"
        />
        <InputField
          type="text"
          placeholder="៛..."
          name="khr"
          label="Cambodian Riel (No comma)"
        />
      </div>

      {/* Conditional rendering for USD bills */}
      <div
        className={`${
          watch("usd") ? "space-y-4" : "hidden"
        } duration-500 ease-in-out`}
      >
        <h2>US Dollar Bills</h2>
        <div className="flex gap-4">
          {usdFields.map((field) => (
            <InputField key={field} type="number" label={field} name={field} />
          ))}
        </div>
      </div>

      {/* Conditional rendering for KHR bills */}
      <div
        className={`${
          watch("khr") ? "space-y-4" : "hidden"
        } duration-500 ease-in-out`}
      >
        <h2>Cambodian Riel Bills</h2>
        <div className="grid grid-cols-4 row-span-2 gap-4">
          {khrFields.map((field) => (
            <InputField key={field} type="number" label={field} name={field} />
          ))}
        </div>
      </div>
      <CustomButton
        type="submit"
        theme={`${!canProceed && "dark"}`}
        disabled={!canProceed}
        text="Proceed"
      />
    </Form>
  );
};

export default MoneyCounter;
