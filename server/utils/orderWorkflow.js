const orderTransitions = {
  PendingApproval: ["Accepted", "Rejected"],
  Accepted: ["Shipped"],
  Shipped: ["Delivered"],
  Delivered: [],
  Rejected: []
};

export const ORDER_STATUSES = Object.keys(orderTransitions);
export const ORDER_PAYMENT_STATUSES = ["Unpaid", "AwaitingPayment", "Paid", "Failed", "Refunded"];

export const canTransitionOrder = (currentStatus, nextStatus) => {
  return orderTransitions[currentStatus]?.includes(nextStatus) ?? false;
};
