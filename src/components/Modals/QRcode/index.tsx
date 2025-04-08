import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import CustomButton from "../../Button";
import { aba_acc, aba_baseUrl, aba_code, aba_id } from "@/utils/config";

const PaymentQRCode = ({
  onClose,
  onAction,
  text = "0.00",
}: {
  onClose?: () => void;
  onAction?: () => void;
  text?: string;
}) => {
  const acc = aba_acc;
  const id = aba_id;
  const baseUrl = aba_baseUrl;
  const code = aba_code;

  const paymentUrl = `${baseUrl}${id}&code=${code}&acc=${acc}&amount=${text}&dynamic=true`;

  const [countdown, setCountdown] = useState(30);
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    setCountdown(30);
    setToggle(true);

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          setToggle(false);
          if (onClose) {
            onClose();
          }
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="w-2/4">
      {toggle && (
        <div className="justify-center flex gap-5 flex-col items-center">
          <div className="space-y-5 mb-5 grid grid-cols-2 items-center justify-center gap-4 ">
            <Image
              src={"/assets/plant-no-text.png"}
              alt={"/assets/plant-no-text.png"}
              width={150}
              height={150}
            />
            <Image
              src={"/assets/khqr.png"}
              width={100}
              height={100}
              alt={"/assets/khqr.png"}
            />
          </div>

          <QRCodeSVG value={paymentUrl} size={256} />
          <div className="items-center justify-center flex flex-col">
            <p className="text-2xl font-semibold mt-5">
              Total: ${Number(text).toFixed(2)}
            </p>
            <p className="text-red-500">{countdown} seconds remaining</p>
          </div>
          <div className="grid grid-cols-2 gap-4 my-5">
            <CustomButton text="Complete" onHandleButton={onAction} />
            <CustomButton theme="alarm" text="Close" onHandleButton={onClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentQRCode;
