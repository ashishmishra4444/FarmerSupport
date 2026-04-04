import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ClipboardList, MapPin, Package2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { orderApi } from "../../services/api";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";

const copy = {
  en: {
    backToOrders: "Back to workflow",
    requestTitle: "Buyer request",
    requestSubtitle: "Review the ordered items, stock availability, and update the workflow from this page.",
    buyerFallback: "Buyer",
    deliveryAddress: "Delivery address",
    orderItems: "Ordered items",
    orderSummary: "Order summary",
    available: "Available",
    quantity: "Quantity",
    status: "Status",
    payment: "Payment",
    total: "Total",
    notes: "Notes",
    paid: "Paid",
    unpaid: "Unpaid",
    awaitingPayment: "Awaiting payment",
    pendingLabel: "Pending approval",
    rejected: "Rejected",
    accept: "Accept",
    reject: "Reject",
    ship: "Ship",
    deliver: "Deliver",
    statusSaved: "Order status updated successfully.",
    cannotAccept: "Insufficient stock",
    orderMissing: "This buyer request could not be found.",
    openDashboard: "Open farmer dashboard",
    items: "items"
  }
};

const nextStatusAction = {
  PendingApproval: "Accepted",
  Accepted: "Shipped",
  Shipped: "Delivered"
};

const statusTone = {
  PendingApproval: "border-amber-200 bg-amber-50",
  Accepted: "border-sky-200 bg-sky-50",
  Shipped: "border-indigo-200 bg-indigo-50",
  Delivered: "border-emerald-200 bg-emerald-50",
  Rejected: "border-rose-200 bg-rose-50"
};

const statusLabel = (status, text) => {
  if (status === "PendingApproval") return text.pendingLabel;
  if (status === "Rejected") return text.rejected;
  return status;
};

const paymentLabel = (paymentStatus, text) => {
  if (paymentStatus === "Paid") return text.paid;
  if (paymentStatus === "AwaitingPayment") return text.awaitingPayment;
  return text.unpaid;
};

const formatAddress = (shippingAddress = {}) => {
  return [
    shippingAddress.addressLine1,
    shippingAddress.addressLine2,
    shippingAddress.district,
    shippingAddress.state,
    shippingAddress.postalCode
  ].filter(Boolean).join(", ");
};

export const FarmerOrderDetailsView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const toast = useToast();
  const text = copy[i18n.language] || copy.en;

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ["farmer-order", orderId],
    queryFn: () => orderApi.getById(orderId),
    enabled: Boolean(orderId)
  });

  const order = orderResponse?.data;
  const canAccept = order?.items?.every((item) => (item.product?.stock ?? 0) >= item.quantity) ?? false;
  const nextStatus = order ? nextStatusAction[order.status] : null;
  const canShip = order?.status === "Accepted" && order?.paymentStatus === "Paid";
  const nextLabel = nextStatus === "Accepted" ? text.accept : nextStatus === "Shipped" ? text.ship : nextStatus === "Delivered" ? text.deliver : null;

  const updateStatus = useMutation({
    mutationFn: ({ orderId: currentOrderId, status }) => orderApi.updateStatus(currentOrderId, { status }),
    onSuccess: () => {
      toast.success(text.statusSaved);
      queryClient.invalidateQueries({ queryKey: ["farmer-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["farmer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["farmer-order-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["farmer-products"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-products"] });
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || text.cannotAccept);
    }
  });

  if (isLoading) {
    return <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">Loading buyer request...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">{text.orderMissing}</p>
        <Link to="/farmer" className="mt-4 inline-flex rounded-full border border-emerald-200 px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50">
          {text.openDashboard}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/farmer")}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {text.backToOrders}
      </button>

      <section className={`rounded-[2rem] border p-6 shadow-[0_18px_36px_rgba(15,23,42,0.08)] ${statusTone[order.status] || "border-slate-200 bg-white"}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{text.requestTitle}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{order.buyer?.name || text.buyerFallback}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{text.requestSubtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-800">{text.status}: {statusLabel(order.status, text)}</span>
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-800">{text.payment}: {paymentLabel(order.paymentStatus, text)}</span>
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-800">{text.total}: Rs {order.totalAmount}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {order.status === "PendingApproval" ? (
              <>
                <button
                  type="button"
                  disabled={!canAccept || updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ orderId: order._id, status: "Accepted" })}
                  className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {text.accept}
                </button>
                <button
                  type="button"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ orderId: order._id, status: "Rejected" })}
                  className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {text.reject}
                </button>
              </>
            ) : null}
            {order.status === "Accepted" && canShip ? (
              <button
                type="button"
                disabled={updateStatus.isPending}
                onClick={() => updateStatus.mutate({ orderId: order._id, status: "Shipped" })}
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {text.ship}
              </button>
            ) : null}
            {order.status === "Shipped" ? (
              <button
                type="button"
                disabled={updateStatus.isPending}
                onClick={() => updateStatus.mutate({ orderId: order._id, status: "Delivered" })}
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {text.deliver}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Package2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">{text.orderItems}</h2>
          </div>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id || item.productName} className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">{item.productName}</p>
                    <p className="mt-2 text-sm text-slate-600">{text.quantity}: {item.quantity}</p>
                    <p className="mt-1 text-sm text-slate-600">{text.available}: {item.product?.stock ?? 0} {item.product?.unit || text.items}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                    <p className="text-sm text-slate-500">Unit</p>
                    <p className="text-lg font-semibold text-emerald-700">Rs {item.unitPrice}</p>
                    <p className="mt-1 text-sm text-slate-500">Line total: Rs {item.totalPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">{text.orderSummary}</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>{text.status}</span>
                <span className="font-medium text-slate-800">{statusLabel(order.status, text)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>{text.payment}</span>
                <span className="font-medium text-slate-800">{paymentLabel(order.paymentStatus, text)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>{text.total}</span>
                <span className="font-medium text-slate-800">Rs {order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">{text.deliveryAddress}</h2>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p className="font-medium text-slate-800">{order.shippingAddress?.fullName || order.buyer?.name || text.buyerFallback}</p>
              <p>{formatAddress(order.shippingAddress) || "-"}</p>
              <p>{order.shippingAddress?.phone || "-"}</p>
            </div>
            {order.notes ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                <span className="font-medium text-slate-800">{text.notes}:</span> {order.notes}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};
