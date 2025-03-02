import { useAuthContext } from "@/context/AuthContext";
import { createLog, ILog, countLog } from "@/services/log";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import Form from "@/components/Form";
import CustomButton from "@/components/Button";
import {
  generateDefaultValues,
  khrFields,
  usdFields,
} from "@/constants/MoneyCounter";

export const MoneyCounter = () => {
  const methods = useForm<ILog>({
    defaultValues: {
      ...generateDefaultValues(usdFields),
      ...generateDefaultValues(khrFields),
    },
  });

  const { watch, trigger } = methods;
  const { profile } = useAuthContext();
  const [canProceed, setCanProceed] = useState(false);
  const router = useRouter();

  // Collect and convert field values to numbers
  const collectFields = (fields: readonly string[]) => {
    return fields.reduce((acc, field) => {
      acc[field] = Number(watch(field)) || 0; // Ensure numeric conversion
      return acc;
    }, {} as Record<string, number>);
  };

  const riels = collectFields(khrFields);
  const dollars = collectFields(usdFields);

  const handleModalClose = () => {
    router.push("/admin/dashboard");
  };

  // Check if at least one field has a valid value
  const checkFieldsFilled = () => {
    const fieldValues = [...usdFields, ...khrFields].reduce((acc, field) => {
      acc[field] = Number(watch(field)) || 0;
      return acc;
    }, {} as Record<string, number>);
    const hasValidField = Object.values(fieldValues).some(
      (value) => value !== 0
    );
    setCanProceed(hasValidField);
  };

  useEffect(() => {
    checkFieldsFilled();
    trigger();
  }, [
    ...usdFields.map((field) => watch(field)),
    ...khrFields.map((field) => watch(field)),
  ]);

  const onSubmitForm = async (data: ILog) => {
    data = {
      createdBy: profile?.firstname as string,
      riels,
      dollars,
    };

    try {
      const response = await createLog(data);
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

      <div className="space-y-4">
        <h2>Cambodian Riel Bills</h2>
        <div className="grid grid-cols-4 row-span-2 gap-4">
          {khrFields.map((field) => (
            <InputField key={field} type="number" label={field} name={field} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2>US Dollar Bills</h2>
        <div className="flex gap-4">
          {usdFields.map((field) => (
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
