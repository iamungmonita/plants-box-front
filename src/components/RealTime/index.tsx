"use client";
import { useEffect, useState } from "react";

const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("en-US", { weekday: "long" });

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${weekday} ${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};

const LocalTime = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now); // Mounting trigger to enable rendering

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentTime) return null; // Prevent mismatch on initial SSR

  return (
    <div className="flex flex-col justify-end items-end">
      <span>{formatDate(currentTime)},</span>
      <span>{currentTime.toLocaleTimeString()}</span>
    </div>
  );
};

export default LocalTime;
