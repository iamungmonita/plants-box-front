export const optionsMembership = [
  { value: "Silver", label: "Silver (5%)" },
  { value: "Gold", label: "Gold (7%)" },
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
