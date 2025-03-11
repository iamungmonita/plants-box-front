"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/Button";
import Form from "@/components/Form";
import AutocompleteForm from "@/components/Autocomplete";
import { IMembership, retrieveMembership } from "@/services/membership";

const ConfirmOrder = ({
  onClose,
  onAction,
  text,
}: {
  onClose?: () => void;
  onAction?: () => void;
  text?: string;
}) => {
  return (
    <div className="flex flex-col min-h-full w-3/4 gap-4">
      <p className="text-2xl">{text}</p>
      <div className="grid grid-cols-2 gap-4">
        <CustomButton text="Place Order" onHandleButton={onAction} />
        <CustomButton text="Not Yet" theme="alarm" onHandleButton={onClose} />
      </div>
    </div>
  );
};

export default ConfirmOrder;
