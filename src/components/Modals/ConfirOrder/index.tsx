"use client";

import React from "react";
import CustomButton from "@/components/Button";

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
        <CustomButton text="Confirm" onHandleButton={onAction} />
        <CustomButton text="Cancel" theme="alarm" onHandleButton={onClose} />
      </div>
    </div>
  );
};

export default ConfirmOrder;
