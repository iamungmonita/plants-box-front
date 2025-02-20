"use client";
import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import ShippingForm from "@/components/Steps/ShippingForm";
import PaymentForm from "@/components/Steps/PaymentForm";
import ReviewOrder from "@/components/Steps/ReviewOrder";
import { ArrowLeftRounded, ArrowRightAltRounded } from "@mui/icons-material";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
const steps = ["Shipping", "Payment", "Complete"];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmitOrder = () => {
    // Simulate order submission
    alert("Order placed successfully!");
    setActiveStep(0);
  };
  const routes = ["/"];
  const pathname = usePathname();
  const [toggleWidth, setToggleWidth] = useState(false);
  React.useEffect(() => {
    setToggleWidth(routes.some((route) => pathname.startsWith(route)));
  }, [pathname]);

  return (
    <div className="max-w-7xl mx-auto w-full h-screen items-start">
      <div className="">
        <h2 className="text-center text-2xl font-bold">Checkout</h2>
        <Stepper
          sx={{ width: "100%" }}
          className="w-full my-5"
          activeStep={activeStep}
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div
        className={`${
          activeStep === 2 ? "border-none" : "border"
        } flex-row max-h-[65vh]  mb-4`}
      >
        {activeStep === 0 && <ReviewOrder handleNext={handleNext} />}
        {activeStep === 2 && <ShippingForm />}
        {activeStep === 1 && <PaymentForm handleNext={handleNext} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex w-full justify-between">
        {activeStep > 0 && (
          <Button
            variant="outlined"
            onClick={handleBack}
            className="bg-gray-500 capitalize flex items-center gap-4 text-white rounded hover:bg-blue-600"
          >
            <FiArrowLeft />
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="outlined"
            onClick={handleNext}
            className="bg-green-700 capitalize flex items-center gap-4 text-white rounded hover:bg-blue-600"
          >
            Next
            <FiArrowRight />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitOrder}
          >
            Place Order
          </Button>
        )}
      </div>
      <Link href="/products">
        <Button
          variant="outlined"
          style={{
            borderColor: "var(--secondary)",
            color: "var(--secondary)",
            fontFamily: "var(--text)",
          }}
          className="mt-4 capitalize flex items-center gap-4 text-white rounded "
        >
          <FiArrowLeft />
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default Checkout;
