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

  return (
    <div className="max-w-7xl mx-auto w-full items-start my-5">
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
          activeStep === 2 ? "" : "border"
        } overflow-y-scroll  scroll-container`}
      >
        {activeStep === 0 && <ReviewOrder handleNext={handleNext} />}
        {activeStep === 2 && <ShippingForm />}
        {activeStep === 1 && <PaymentForm handleNext={handleNext} />}
      </div>
      {/* Navigation Buttons */}
      <div className="flex w-full justify-between py-4">
        {activeStep !== 2 && (
          <Button
            variant="outlined"
            onClick={handleBack}
            className="bg-gray-500 capitalize flex items-center gap-4 text-white rounded hover:bg-blue-600"
          >
            <FiArrowLeft />
            Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
