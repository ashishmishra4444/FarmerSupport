const orderTransitions = {
  Pending: ["Accepted", "Rejected"],
  Accepted: ["Shipped"],
  Shipped: ["Delivered"],
  Delivered: [],
  Rejected: []
};

export const ORDER_STATUSES = Object.keys(orderTransitions);

export const canTransitionOrder = (currentStatus, nextStatus) => {
  return orderTransitions[currentStatus]?.includes(nextStatus) ?? false;
};
