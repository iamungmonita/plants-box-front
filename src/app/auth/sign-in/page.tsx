"use client";

import Form from "@/components/Form";
import InputField from "@/components/InputText";
import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogInSchema } from "@/schema/auth";
import { Button } from "@mui/material";
import { IAuthLogIn } from "@/models/auth";
import { getAdminProfile, SignIn } from "@/services/authentication";
import BasicModal from "@/components/Modal";
import { InitialCount, DailyLog } from "@/services/log";
import { InitialCountContent } from "@/components/Modals/InitialCount";

const Page = () => {
  const { signIn, onRefresh, profile, isAuthenticated } = useAuthContext();
  const methods = useForm<IAuthLogIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LogInSchema),
  });
  const { setError } = methods;
  const router = useRouter();

  const [toggle, setToggle] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmitForm = async (data: IAuthLogIn) => {
    const response = await SignIn(data);

    if ("admin" in response) {
      signIn();
      onRefresh();
      // const firstLogin = await DailyLog({
      //   userId: response.admin._id,
      // });
      // if (!firstLogin) {
      //   setToggle(false);
      //   router.push("/admin/dashboard");
      //   return;
      // }
      setToggle(true); // Show the modal
    } else {
      setError(response.name as "email" | "password", {
        type: "manual",
        message: response.message,
      });
      console.log(response.message);
    }
  };

  // Confirmation button inside modal
  const handleModalClose = () => {
    setToggle(false);
    router.push("/admin/dashboard");
  };

  //   const handleInitialCount = async (
  //     event: React.FormEvent<HTMLFormElement>
  //   ) => {
  //     event.preventDefault(); // Prevent page reload
  //
  //     const formData = new FormData(event.currentTarget);
  //     const dollar = formData.get("dollar") as string; // Get input value
  //     const riel = formData.get("riel") as string; // Get input value
  //     const data = {
  //       dollar: dollar ? parseFloat(dollar) : 0,
  //       riel: riel ? parseFloat(riel) : 0,
  //       counter: profile?.username as string,
  //     };
  //     try {
  //       const response = await InitialCount(data);
  //
  //       if (response.message) {
  //         setErrorMessage(response.message); // Show the error message in an alert
  //       } else {
  //         console.log("Success:", response);
  //         handleModalClose();
  //       }
  //     } catch (error) {
  //       console.error("Request failed:", error);
  //       alert("Something went wrong. Please try again."); // Generic error handling
  //     } // Replace with actual logic
  //   };

  //   const ModalContent = () => {
  //     return (
  //       <form onSubmit={handleInitialCount}>
  //         <h2 className="text-xl font-bold">Initial Count</h2>
  //         <p>
  //           You will be redirected to the admin dashboard after finish counting
  //           the money.
  //         </p>
  //         <input
  //           type="text"
  //           placeholder="$..."
  //           name="dollar"
  //           className="p-2 rounded border"
  //         />
  //         <input
  //           type="text"
  //           placeholder="៛..."
  //           name="riel"
  //           className="p-2 rounded border"
  //         />
  //         {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  //
  //         <Button variant="contained" type="submit">
  //           Proceed
  //         </Button>
  //       </form>
  //     );
  //   };
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="max-w-[400px] w-full">
        <h2 className="text-center font-semibold text-lg uppercase">
          Log In Admin
        </h2>

        {/* Modal */}
        <BasicModal
          content={<InitialCountContent />}
          open={toggle}
          onClose={handleModalClose}
        />

        <Form
          methods={methods}
          className="grid grid-cols-1 p-2 space-y-6"
          onSubmit={onSubmitForm}
        >
          <InputField name="email" type="email" label="Email" />
          <InputField name="password" type="password" label="Password" />
          <Button variant="contained" type="submit">
            Submit
          </Button>
          <Button href="/auth/sign-up" type="button">
            Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Page;
