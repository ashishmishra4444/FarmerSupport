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
    pendingLabel: "Pending",
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
  },
  hi: {
    backToOrders: "वर्कफ़्लो पर वापस जाएँ",
    requestTitle: "खरीदार अनुरोध",
    requestSubtitle: "इस पेज से ऑर्डर किए गए आइटम, उपलब्ध स्टॉक और वर्कफ़्लो अपडेट देखें।",
    buyerFallback: "खरीदार",
    deliveryAddress: "डिलीवरी पता",
    orderItems: "ऑर्डर किए गए आइटम",
    orderSummary: "ऑर्डर सारांश",
    available: "उपलब्ध",
    quantity: "मात्रा",
    status: "स्थिति",
    payment: "भुगतान",
    total: "कुल",
    notes: "नोट्स",
    paid: "भुगतान हो चुका",
    pendingLabel: "लंबित",
    rejected: "अस्वीकृत",
    accept: "स्वीकार करें",
    reject: "अस्वीकार करें",
    ship: "शिप करें",
    deliver: "डिलीवर करें",
    statusSaved: "ऑर्डर स्टेटस सफलतापूर्वक अपडेट हुआ।",
    cannotAccept: "स्टॉक पर्याप्त नहीं",
    orderMissing: "यह खरीदार अनुरोध नहीं मिला।",
    openDashboard: "किसान डैशबोर्ड खोलें",
    items: "आइटम"
  },
  od: {
    backToOrders: "ୱର୍କଫ୍ଲୋକୁ ଫେରନ୍ତୁ",
    requestTitle: "କ୍ରେତା ଅନୁରୋଧ",
    requestSubtitle: "ଏହି ପେଜରୁ ଅର୍ଡର ହୋଇଥିବା ଆଇଟମ୍, ଉପଲବ୍ଧ ଷ୍ଟକ ଏବଂ ୱର୍କଫ୍ଲୋ ଅପଡେଟ୍ ଦେଖନ୍ତୁ।",
    buyerFallback: "କ୍ରେତା",
    deliveryAddress: "ଡିଲିଭରି ଠିକଣା",
    orderItems: "ଅର୍ଡର ହୋଇଥିବା ଆଇଟମ୍",
    orderSummary: "ଅର୍ଡର ସାରାଂଶ",
    available: "ଉପଲବ୍ଧ",
    quantity: "ପରିମାଣ",
    status: "ସ୍ଥିତି",
    payment: "ଭୁଗତାନ",
    total: "ମୋଟ",
    notes: "ଟିପ୍ପଣୀ",
    paid: "ଭୁଗତାନ ହୋଇଛି",
    pendingLabel: "ଅପେକ୍ଷାରତ",
    rejected: "ଅସ୍ୱୀକୃତ",
    accept: "ଗ୍ରହଣ କରନ୍ତୁ",
    reject: "ଅସ୍ୱୀକାର କରନ୍ତୁ",
    ship: "ଶିପ୍ କରନ୍ତୁ",
    deliver: "ଡେଲିଭରି କରନ୍ତୁ",
    statusSaved: "ଅର୍ଡର ଷ୍ଟେଟସ ସଫଳତାର ସହ ଅପଡେଟ୍ ହେଲା।",
    cannotAccept: "ଷ୍ଟକ ପର୍ଯ୍ୟାପ୍ତ ନୁହେଁ",
    orderMissing: "ଏହି କ୍ରେତା ଅନୁରୋଧ ମିଳିଲା ନାହିଁ।",
    openDashboard: "କୃଷକ ଡ୍ୟାଶବୋର୍ଡ ଖୋଲନ୍ତୁ",
    items: "ଆଇଟମ୍"
  }
};

const nextStatusAction = {
  Pending: "Accepted",
  Accepted: "Shipped",
  Shipped: "Delivered"
};

const statusTone = {
  Pending: "border-amber-200 bg-amber-50",
  Accepted: "border-sky-200 bg-sky-50",
  Shipped: "border-indigo-200 bg-indigo-50",
  Delivered: "border-emerald-200 bg-emerald-50",
  Rejected: "border-rose-200 bg-rose-50"
};

const statusLabel = (status, text) => {
  if (status === "Pending") return text.pendingLabel;
  if (status === "Rejected") return text.rejected;
  return status;
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
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-800">{text.payment}: {order.paymentStatus === "Paid" ? text.paid : text.pendingLabel}</span>
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-800">{text.total}: Rs {order.totalAmount}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {order.status === "Pending" ? (
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
            {order.status !== "Pending" && nextStatus ? (
              <button
                type="button"
                disabled={updateStatus.isPending}
                onClick={() => updateStatus.mutate({ orderId: order._id, status: nextStatus })}
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {nextLabel}
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
                <span className="font-medium text-slate-800">{order.paymentStatus === "Paid" ? text.paid : text.pendingLabel}</span>
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
