import { useAuthContext } from "@/context/AuthContext";
import { ILog, InitialCount } from "@/services/log";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputText";
import Form from "@/components/Form";

export const InitialCountContent = () => {
  const methods = useForm<ILog>({
    defaultValues: {
      usd: "",
      khr: "",
    },
  });
  const {
    watch,
    setError,
    formState: { errors },
    clearErrors,
  } = methods;
  const { profile } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [canProceed, setCanProceed] = useState<boolean>(false); // Track if the form can proceed
  const router = useRouter();

  const handleModalClose = () => {
    setToggle(false);
    router.push("/admin/dashboard");
  };

  const khrFields = [
    "100000R",
    "50000R",
    "20000R",
    "10000R",
    "5000R",
    "1000R",
    "500R",
    "100R",
  ] as const;

  const usdFields = ["100$", "50$", "20$", "10$", "5$", "1$"] as const;

  useEffect(() => {
    validateBills();
  }, [
    watch("usd"),
    watch("khr"),
    ...usdFields.map((field) => watch(field)),
    ...khrFields.map((field) => watch(field)),
  ]);

  // Validate Bills function
  const validateBills = () => {
    const usd = Number(watch("usd")) || 0;
    const khr = Number(watch("khr")) || 0;

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
      return; // Stop further validation
    } else {
      clearErrors("khr"); // Clear the error if valid
    }
    // Validate if totals match
    if (usdTotal === usd && khrTotal === khr) {
      setCanProceed(true); // Enable proceed button when the breakdowns are correct
      clearErrors("usd");
      clearErrors("khr");
    } else {
      setCanProceed(false); // Disable proceed button if the breakdowns are incorrect
      if (usdTotal !== usd) {
        setError("usd", {
          type: "manual",
          message: "USD breakdown does not match.",
        });
        return;
      } else {
        clearErrors("usd");
      }
      if (khrTotal !== khr) {
        setError("khr", {
          type: "manual",
          message: "KHR breakdown does not match.",
        });
        return;
      } else {
        clearErrors("khr");
      }
    }
  };

  // Get multipliers for USD and KHR bills
  const getUsdMultiplier = (field: string) => {
    const multipliers: Record<string, number> = {
      "100$": 100,
      "50$": 50,
      "20$": 20,
      "10$": 10,
      "5$": 5,
      "1$": 1,
    };
    return multipliers[field] || 0;
  };

  const getKhrMultiplier = (field: string) => {
    const multipliers: Record<string, number> = {
      "100000R": 100000,
      "50000R": 50000,
      "20000R": 20000,
      "10000R": 10000,
      "5000R": 5000,
      "1000R": 1000,
      "500R": 500,
      "100R": 100,
    };
    return multipliers[field] || 0;
  };

  const onSubmitForm = async (data: ILog) => {
    const usd = watch("usd");
    const khr = watch("khr");
    // type CurrencyFields = {
    //   [key in (typeof khrFields | typeof usdFields)[number]]:
    //     | number
    //     | undefined;
    // };
    // Watch all fields dynamically
    const riels = khrFields.reduce((acc, field) => {
      acc[field] = watch(field);
      return acc;
    }, {} as Record<string, number>);

    const dollars = usdFields.reduce((acc, field) => {
      acc[field] = watch(field);
      return acc;
    }, {} as Record<string, number>);

    data = {
      usd,
      khr,
      counter: profile?.firstname as string,
      riels, // Assign the khr fields directly
      dollars,
    };
    try {
      const response = await InitialCount(data);
      console.log("Full Response:", response); // Log full response to check the structure

      // Check if the response contains a specific field error (usd or khr)
      if (response?.name === "usd" || response?.name === "khr") {
        setError(response.name as "usd" | "khr", {
          type: "manual",
          message: response.message,
        });
      } else if (response?.errors) {
        response.errors.forEach((error: { name: string; message: string }) => {
          setError(error.name as "usd" | "khr", {
            type: "manual",
            message: error.message,
          });
        });
      } else {
        console.log("Success:", response);
        handleModalClose();
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Form
      methods={methods}
      onSubmit={onSubmitForm}
      className="w-3/4 mx-auto space-y-10"
    >
      <h2 className="text-xl font-bold">
        Before you proceed, please count the money.
      </h2>

      <div className="flex gap-4">
        <InputField label="USD" type="text" placeholder="$..." name="usd" />
        <InputField
          type="text"
          placeholder="៛..."
          name="khr"
          label="Cambodian Riel"
        />
      </div>

      <div
        className={`${
          watch("usd") ? "space-y-4" : "hidden"
        } duration-500 ease-in-out transition-all`}
      >
        <h2>US Dollar Bills</h2>
        <div className="flex gap-4">
          <InputField type="number" label="100$" name="100$" />
          <InputField type="number" label="50$" name="50$" />
          <InputField type="number" label="20$" name="20$" />
          <InputField type="number" label="10$" name="10$" />
          <InputField type="number" label="5$" name="5$" />
          <InputField type="number" label="1$" name="1$" />
        </div>
      </div>
      <div
        className={`${
          watch("khr") ? "space-y-4" : "hidden"
        } duration-500 ease-in-out transition-all`}
      >
        <h2>Cambodian Riel Bills</h2>
        <div className="grid grid-cols-4 row-span-2 gap-4">
          <InputField type="number" label="100,000" name="100000R" />
          <InputField type="number" label="50,000" name="50000R" />
          <InputField type="number" label="20,000" name="20000R" />
          <InputField type="number" label="10,000" name="10000R" />
          <InputField type="number" label="5,000" name="5000R" />
          <InputField type="number" label="1,000" name="1000R" />
          <InputField type="number" label="500" name="500R" />
          <InputField type="number" label="100" name="100R" />
        </div>
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <Button
        variant="outlined"
        sx={{
          backgroundColor: "var(--medium-light)",
          border: "none",
          color: "white",
        }}
        type="submit"
        disabled={!canProceed} // Disable submit button if validation fails
      >
        <p className="px-4 py-2">Proceed</p>
      </Button>
    </Form>
  );
};

export default InitialCount;
