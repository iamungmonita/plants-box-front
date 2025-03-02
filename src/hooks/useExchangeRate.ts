import { useState, useEffect } from "react";

// Custom hook to manage exchange rate
export const useExchangeRate = (): number => {
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const checkExchangeRate = (): number => {
    const prevRate = localStorage.getItem("exchange-rate");
    if (!prevRate) {
      localStorage.setItem("exchange-rate", "4000");
      window.dispatchEvent(new Event("exchangeRateUpdated"));
      setExchangeRate(4000);
      return 4000;
    }

    const rate = parseFloat(prevRate);
    setExchangeRate(rate);
    return rate;
  };

  useEffect(() => {
    // Initial check when the component mounts
    checkExchangeRate();

    // Listener for exchange rate updates
    const handleExchangeRateUpdated = () => {
      checkExchangeRate();
    };

    window.addEventListener("exchangeRateUpdated", handleExchangeRateUpdated);

    return () => {
      window.removeEventListener(
        "exchangeRateUpdated",
        handleExchangeRateUpdated
      );
    };
  }, []);

  return exchangeRate; // Return the current exchange rate
};
