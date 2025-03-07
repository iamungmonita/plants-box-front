export const amountToPoint = (amount: number) => {
  const point = amount / 10;
  return point;
};

export const pointToAmount = (point: number) => {
  const amount = point / 10;
  return amount;
};

export const sum = (array: unknown): number => {
  if (!Array.isArray(array)) {
    console.error("Expected an array, but got:", array);
    return 0;
  }

  return array
    .map((num) => (typeof num === "number" ? num : Number(num) || 0)) // Convert to number, replace NaN with 0
    .reduce((acc, num) => acc + num, 0);
};
