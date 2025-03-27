export const OrderStatus = {
  COMPLETE: 1,
  PENDING: 2,
  CANCELLED: 3,
};

export const PaymentStatus = {
  COMPLETE: 1,
  PENDING: 2,
  CANCELLED: 3,
};

export const getOrderLabel = (status: number): string => {
  switch (status) {
    case OrderStatus.COMPLETE:
      return "Complete";
    case OrderStatus.PENDING:
      return "Pending";
    case OrderStatus.CANCELLED:
      return "Cancelled";
    default:
      return "Unknown";
  }
};
export const getPaymentLabel = (status: number): string => {
  switch (status) {
    case PaymentStatus.COMPLETE:
      return "Paid";
    case PaymentStatus.PENDING:
      return "Pending";
    case PaymentStatus.CANCELLED:
      return "Cancelled";
    default:
      return "Unknown";
  }
};
