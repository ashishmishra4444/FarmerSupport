import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { paymentApi } from "../services/api";

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
};

export const InvoicePage = () => {
  const { orderId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["payment-invoice", orderId],
    queryFn: () => paymentApi.invoice(orderId),
    enabled: Boolean(orderId)
  });

  if (isLoading) {
    return <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">Loading invoice...</div>;
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-rose-600">{error.response?.data?.message || "Unable to load invoice."}</p>
        <Link to="/buyer" className="mt-4 inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">
          Back to buyer dashboard
        </Link>
      </div>
    );
  }

  const invoice = data?.data;
  const order = invoice?.order;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Invoice</h1>
          <p className="mt-2 text-sm text-slate-500">Invoice number: {invoice.invoiceNumber}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/buyer" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
            Back
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Print Invoice
          </button>
        </div>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Billed To</p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{order.buyer?.name || "Buyer"}</h2>
            <p className="mt-1 text-sm text-slate-500">{order.buyer?.email || "-"}</p>
            <p className="mt-3 text-sm text-slate-600">{order.shippingAddress?.addressLine1 || "-"}</p>
            <p className="text-sm text-slate-600">{[order.shippingAddress?.district, order.shippingAddress?.state, order.shippingAddress?.postalCode].filter(Boolean).join(", ") || "-"}</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Payment Details</p>
            <p className="mt-3 text-sm text-slate-600">Paid at: {formatDate(invoice.paidAt)}</p>
            <p className="mt-1 text-sm text-slate-600">Provider: {invoice.provider}</p>
            <p className="mt-1 text-sm text-slate-600">Payment ID: {invoice.providerPaymentId || "-"}</p>
            <p className="mt-1 text-sm text-slate-600">Order ID: {invoice.providerOrderId || "-"}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Unit Price</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {order.items.map((item) => (
                <tr key={`${item.productName}-${item.quantity}`}>
                  <td className="px-4 py-3">{item.productName}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">Rs {item.unitPrice}</td>
                  <td className="px-4 py-3 text-right">Rs {item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 ml-auto max-w-sm space-y-2 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>Rs {order.subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Delivery</span>
            <span>Rs {order.deliveryCharge}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>Rs {order.totalAmount}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
