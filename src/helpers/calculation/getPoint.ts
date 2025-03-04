export const amountToPoint = (amount: number) => {
  const point = amount / 10;
  return point;
};

export const pointToAmount = (point: number) => {
  const amount = point / 10;
  return amount;
};
