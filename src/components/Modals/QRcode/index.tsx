import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import CustomButton from "../../Button";

const PaymentQRCode = ({
  onClose,
  text = "0.00",
}: {
  onClose?: () => void;
  text?: string;
}) => {
  const acc = process.env.NEXT_PUBLIC_ABA_ACC;
  const id = process.env.NEXT_PUBLIC_ABA_ID;
  const baseUrl = process.env.NEXT_PUBLIC_ABA_BASEURL;
  const code = process.env.NEXT_PUBLIC_ABA_CODE;

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
        <div className="justify-center flex gap-6 flex-col items-center">
          <div className="space-y-4 ">
            <Image
              src={"/assets/khqr.png"}
              width={100}
              height={100}
              alt={"/assets/khqr.png"}
            />
          </div>
          <QRCodeSVG value={paymentUrl} size={256} />
          <p>{countdown} seconds remaining</p>
          <CustomButton theme="alarm" text="Close" onHandleButton={onClose} />
        </div>
      )}
    </div>
  );
};

export default PaymentQRCode;
