import { useEffect, useState } from "react";
import { useExchangeRate } from "./useExchangeRate";
const usePaymentChange = ({
  payment,
  paymentKHR,
  totalAmount,
  toggleKHR,
  refresh,
}: {
  payment: string;
  paymentKHR: string;
  totalAmount: number;
  toggleKHR: boolean;
  refresh: boolean;
}) => {
  const [change, setChange] = useState<number>(0);
  const exchangeRate = useExchangeRate();

  useEffect(() => {
    setChange(0);
    const timeout = setTimeout(() => {
      const validPayment = isNaN(Number(payment)) ? 0 : Number(payment);
      const validPaymentKHR = isNaN(Number(paymentKHR))
        ? 0
        : Number(paymentKHR);

      if (validPaymentKHR && validPayment) {
        const converted = validPaymentKHR / exchangeRate;
        const combined = converted + validPayment;
        setChange(combined - totalAmount);
      } else if (validPayment) {
        setChange(validPayment - totalAmount);
      } else if (validPaymentKHR) {
        setChange(validPaymentKHR / exchangeRate - totalAmount);
      } else {
        setChange(0);
      }
    }, 1000); // Delay calculation by 500ms after last input

    return () => clearTimeout(timeout); // Cleanup timeout on each keystroke
  }, [payment, totalAmount, paymentKHR, toggleKHR, refresh]);

  return change;
};
export default usePaymentChange;
