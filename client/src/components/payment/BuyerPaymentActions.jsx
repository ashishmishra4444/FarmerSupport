import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paymentApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";

let razorpayScriptPromise;

const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
};

export const BuyerPaymentActions = ({ order, onPaid }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const openInvoice = () => navigate(`/buyer/orders/${order._id}/invoice`);
  const canPayNow = order.status === "Accepted" && order.paymentStatus === "AwaitingPayment";

  const startPayment = async () => {
    if (order.paymentStatus === "Paid") {
      openInvoice();
      return;
    }

    if (!canPayNow) {
      toast.info("Payment will be available after the farmer accepts your order.");
      return;
    }

    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded) {
        throw new Error("Razorpay checkout could not be loaded");
      }

      const orderResponse = await paymentApi.createOrder(order._id);
      const checkout = orderResponse.data;

      const razorpay = new window.Razorpay({
        key: checkout.key,
        amount: checkout.amount,
        currency: checkout.currency,
        name: checkout.name,
        description: checkout.description,
        order_id: checkout.orderId,
        prefill: checkout.buyer,
        notes: {
          internalOrderId: checkout.internalOrderId
        },
        theme: {
          color: "#16a34a"
        },
        handler: async (response) => {
          try {
            await paymentApi.verify(order._id, response);
            toast.success("Payment successful. Invoice is ready.");
            onPaid?.();
            navigate(`/buyer/orders/${order._id}/invoice`);
          } catch (error) {
            const verifyMessage = error.response?.data?.message || "Payment verification failed.";

            try {
              await paymentApi.invoice(order._id);
              toast.success("Payment successful. Invoice is ready.");
              onPaid?.();
              navigate(`/buyer/orders/${order._id}/invoice`);
            } catch (_invoiceError) {
              toast.error(verifyMessage);
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      });

      razorpay.open();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || error.message || "Unable to start payment right now.");
    }
  };

  if (order.paymentStatus === "Paid") {
    return (
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={openInvoice}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
        >
          View Invoice
        </button>
      </div>
    );
  }

  if (!canPayNow) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={startPayment}
        disabled={loading}
        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Opening Razorpay..." : "Pay Now"}
      </button>
    </div>
  );
};

