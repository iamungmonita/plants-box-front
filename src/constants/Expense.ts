export enum categoryType {
  SUPPLIES = "Supplies",
  INVENTORY = "Inventory",
  UTILITIES = "Utilities",
  RENT = "Rent",
  SALARIES = "Salaries",
  MARKETING = "Marketing",
  OTHERS = "Other",
}

export const expensesCategory = [
  { value: categoryType.INVENTORY, label: categoryType.INVENTORY },
  { value: categoryType.SUPPLIES, label: categoryType.SUPPLIES },
  { value: categoryType.RENT, label: categoryType.RENT },
  { value: categoryType.UTILITIES, label: categoryType.UTILITIES },
  { value: categoryType.SALARIES, label: categoryType.SALARIES },
  { value: categoryType.MARKETING, label: categoryType.MARKETING },
  { value: categoryType.OTHERS, label: categoryType.OTHERS },
];
