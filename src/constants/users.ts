import { useEffect } from "react";

export const optionsUsers = [
  { value: "Owner", label: "Silver (5%)" },
  { value: "Staff", label: "Gold (7%)" },
  { value: "Platinum", label: "Platinum (10%)" },
  { value: "Point", label: "Point" },
];

export const getDiscountValue = (value: string): number => {
  switch (value) {
    case "Silver":
      return 5;
    case "Gold":
      return 7;
    case "Platinum":
      return 10;
    default:
      return 0; // Default case if value is not found
  }
};
