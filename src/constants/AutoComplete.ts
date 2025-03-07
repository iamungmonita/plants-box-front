export const categories = [
  { label: "Plants", value: "Plants" },
  { label: "Pot", value: "Pot" },
  { label: "Accessories", value: "Accessories" },
  { label: "Stone & Soil", value: "Stone & Soil" },
  { label: "Others", value: "Others" },
];

const getCategoryLabelByValue = (value: string): string => {
  switch (value) {
    case "1":
      return "Plants";
    case "2":
      return "Pot";
    case "3":
      return "Accessories";
    case "4":
      return "Stone & Soil";
    case "5":
      return "Others";
    default:
      return "Unknown"; // Default case if value is not found
  }
};
