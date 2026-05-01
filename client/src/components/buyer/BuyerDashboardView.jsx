import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CloudSun, MapPin, ShoppingCart, Store } from "lucide-react";
import { orderApi, productApi } from "../../services/api";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import { useWeather } from "../../hooks/useWeather";
import { useMandi } from "../../hooks/useMandi";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";
import { BuyerPaymentActions } from "../payment/BuyerPaymentActions";

const copy = {
  en: {
    marketplace: "Marketplace",
    filterReady: "Live crop listings from farmers",
    farmersTitle: "Farmers",
    farmersSubtitle: "Select a farmer to view available stock",
    available: "Available",
    inStock: "in stock",
    farmersCount: "farmers available",
    productsCount: "products listed",
    selectFarmer: "Select a farmer",
    pickFarmerPrompt: "Choose a farmer to open their marketplace listings.",
    pickFarmerHelp: "No farmer is selected yet. Start from the farmer list above to see products and stock.",
    noFarmerProducts: "This farmer has no active products right now.",
    quantity: "Qty",
    buy: "Request Order",
    weather: "Weather Alerts",
    mandi: "Live Mandi Ticker",
    myOrders: "My Orders",
    noProducts: "No products are available yet. First add products from a farmer account.",
    noOrders: "No buyer orders yet. Once you request crops from the marketplace, your orders will appear here.",
    demoTip: "Buyer flow: send a request first, wait for the farmer to accept it, then complete payment.",
    items: "items",
    farmer: "Farmer",
    paid: "Paid",
    accepted: "Accepted",
    awaitingPayment: "Awaiting payment",
    rejected: "Rejected",
    pending: "Pending approval",
    unpaid: "Unpaid",
    statusHint: "Orders move through approval first. You can pay only after the farmer accepts your request.",
    locationFallback: "Location is blocked, so weather is shown for a default Odisha location.",
    invalidQuantity: "Enter a valid quantity within available stock.",
    exceedsStock: "Only {{available}} of {{product}} available in stock. Please enter a lower quantity.",
    liveSource: "Auto-refreshing live data",
    total: "Total",
    orderItems: "Order items"
  }
};

const compactQuantity = (quantity, unit = "") => {
  if (!unit) return `${quantity}`;
  const compactUnits = new Set(["kg", "g", "mg", "ml", "l"]);
  return compactUnits.has(unit.toLowerCase()) ? `${quantity}${unit}` : `${quantity} ${unit}`;
};

const translateStatus = (status, text) => {
  if (status === "PendingApproval") return text.pending;
  if (status === "Accepted") return text.accepted;
  if (status === "AwaitingPayment") return text.awaitingPayment;
  if (status === "Paid") return text.paid;
  if (status === "Rejected") return text.rejected;
  if (status === "Unpaid") return text.unpaid;
  return status;
};

const buildQuantityErrorMessage = (product, quantity, text) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return text.invalidQuantity;
  }

  if (quantity > product.stock) {
    return text.exceedsStock
      .replace("{{product}}", product.name)
      .replace("{{available}}", compactQuantity(product.stock, product.unit || text.items));
  }

  return text.invalidQuantity;
};

export const  BuyerDashboardView = () => {
  const coords = useGeoLocation();
  const weather = useWeather(coords);
  const mandi = useMandi();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const toast = useToast();
  const text = copy[i18n.language] || copy.en;
  const [quantities, setQuantities] = useState({});
  const [selectedFarmerId, setSelectedFarmerId] = useState("");

  const { data: products } = useQuery({
    queryKey: ["marketplace-products"],
    queryFn: () => productApi.list({})
  });

  const { data: myOrders } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: orderApi.buyerOrders
  });

  const createOrder = useMutation({
    mutationFn: ({ productId, quantity, district, state }) =>
      orderApi.create({
        items: [{ productId, quantity }],
        deliveryCharge: 0,
        shippingAddress: {
          fullName: "Buyer User",
          phone: "9123456789",
          addressLine1: "Village Road",
          district: district || "Khordha",
          state: state || "Odisha",
          postalCode: "751001"
        }
      }),
    onSuccess: (_response, variables) => {
      setQuantities((current) => ({ ...current, [variables.productId]: "1" }));
      toast.success(`${compactQuantity(variables.quantity, variables.unit)} of ${variables.productName} sent to the farmer for approval.`);
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-products"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || text.invalidQuantity);
    }
  });

  const visibleProducts = products?.data || [];
  const visibleOrders = myOrders?.data || [];
  const latestOrders = useMemo(() => visibleOrders.slice(0, 8), [visibleOrders]);

  const farmers = useMemo(() => {
    const grouped = new Map();

    visibleProducts
      .filter((product) => product.stock > 0 && product.farmer?._id)
      .forEach((product) => {
        const farmerId = product.farmer._id;

        if (!grouped.has(farmerId)) {
          grouped.set(farmerId, {
            id: farmerId,
            name: product.farmer.name || text.farmer,
            location: product.farmer.location || product.location || {},
            productCount: 0,
            totalStock: 0,
            products: []
          });
        }

        const farmer = grouped.get(farmerId);
        farmer.productCount += 1;
        farmer.totalStock += product.stock || 0;
        farmer.products.push(product);
      });

    return Array.from(grouped.values());
  }, [text.farmer, visibleProducts]);

  const activeFarmer = farmers.find((farmer) => farmer.id === selectedFarmerId) || null;

  const normalizeQuantity = (value, maxStock, clampToStock = false) => {
    const parsedQuantity = Number(value);

    if (!Number.isFinite(parsedQuantity)) {
      return "1";
    }

    const normalized = Math.max(1, Math.floor(parsedQuantity));
    return String(clampToStock ? Math.min(normalized, maxStock) : normalized);
  };

  const updateQuantity = (productId, nextQuantity, maxStock, clampToStock = false) => {
    setQuantities((current) => ({
      ...current,
      [productId]: normalizeQuantity(nextQuantity, maxStock, clampToStock)
    }));
  };

  const submitOrder = (product) => {
    const quantity = Number(quantities[product._id] ?? "1");

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
      toast.error(buildQuantityErrorMessage(product, quantity, text));
      return;
    }

    createOrder.mutate({
      productId: product._id,
      productName: product.name,
      unit: product.unit,
      quantity,
      district: product.location?.district,
      state: product.location?.state
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">{text.demoTip}</div>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-semibold">{text.farmersTitle}</h2>
                  <p className="text-sm text-slate-500">{text.farmersSubtitle}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {farmers.length} {text.farmersCount}
              </span>
            </div>
            <div className="space-y-3 max-h-[18rem] overflow-y-auto pr-1">
              {farmers.length ? farmers.map((farmer) => {
                const isActive = farmer.id === selectedFarmerId;
                const locationText = [farmer.location?.district, farmer.location?.state].filter(Boolean).join(", ");

                return (
                  <button
                    key={farmer.id}
                    type="button"
                    onClick={() => setSelectedFarmerId(farmer.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${isActive ? "border-emerald-300 bg-emerald-50 shadow-sm" : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50"}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold">{farmer.name}</p>
                        <p className="text-sm text-slate-500">{locationText || text.selectFarmer}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white px-3 py-1 text-slate-600">{farmer.productCount} {text.productsCount}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-emerald-700">{farmer.totalStock} {text.inStock}</span>
                      </div>
                    </div>
                  </button>
                );
              }) : <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text.noProducts}</div>}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{text.marketplace}</h2>
                <span className="text-sm text-slate-500">{text.filterReady}</span>
              </div>
              {activeFarmer ? <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">{activeFarmer.name}</span> : null}
            </div>
            {!activeFarmer ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="font-medium text-slate-700">{text.pickFarmerPrompt}</p>
                <p className="mt-2 text-sm text-slate-500">{farmers.length ? text.pickFarmerHelp : text.noProducts}</p>
              </div>
            ) : (
              <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
                {activeFarmer.products.length ? activeFarmer.products.map((product) => {
                  const quantity = quantities[product._id] ?? "1";
                  const locationText = [product.location?.district, product.location?.state].filter(Boolean).join(", ");

                  return (
                    <div key={product._id} className="rounded-[1.7rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.cropType}{locationText ? ` • ${locationText}` : ""}</p>
                          <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                            {text.available}: {product.stock} {product.unit || text.items}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-semibold text-emerald-700">Rs {product.price}</p>
                          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                            <span className="text-xs text-slate-500">{text.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(product._id, Number(quantity || 1) - 1, product.stock, true)} className="rounded-full px-2 text-slate-600 hover:bg-slate-100">-</button>
                            <input
                              type="number"
                              min="1"
                              max={product.stock}
                              value={quantity}
                              onFocus={(event) => event.target.select()}
                              onChange={(event) => {
                                const nextValue = event.target.value;
                                if (nextValue === "") {
                                  setQuantities((current) => ({ ...current, [product._id]: "" }));
                                  return;
                                }

                                if (/^\d+$/.test(nextValue)) {
                                  setQuantities((current) => ({ ...current, [product._id]: nextValue }));
                                }
                              }}
                              onBlur={() => updateQuantity(product._id, quantity || "1", product.stock)}
                              className="w-16 border-0 bg-transparent text-center text-sm font-semibold outline-none"
                            />
                            <button type="button" onClick={() => updateQuantity(product._id, Number(quantity || 1) + 1, product.stock, true)} className="rounded-full px-2 text-slate-600 hover:bg-slate-100">+</button>
                          </div>
                          <button
                            type="button"
                            onClick={() => submitOrder(product)}
                            disabled={createOrder.isPending || product.stock < 1}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {text.buy}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }) : <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text.noFarmerProducts}</div>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold">{text.weather}</h2>
              </div>
              <span className="text-xs text-slate-400">{text.liveSource}</span>
            </div>
            {coords.permission === "fallback" ? <p className="mt-3 text-xs text-slate-500">{text.locationFallback}</p> : null}
            <div className="mt-4 space-y-3">
              {(weather.data?.data || []).map((alert, index) => (
                <div key={`${alert.title}-${index}`} className="rounded-2xl bg-sky-50 p-4">
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-slate-600">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">{text.mandi}</h2>
              </div>
              <span className="text-xs text-slate-400">{text.liveSource}</span>
            </div>
            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {(mandi.data?.data || []).slice(0, 8).map((item) => (
                <div key={item._id || `${item.crop}-${item.market}`} className="rounded-2xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.crop}</p>
                      <p className="text-xs text-slate-500">{item.market}, {item.state}</p>
                    </div>
                    <span className="font-semibold text-emerald-700">Rs {item.modalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">{text.myOrders}</h2>
        </div>
        <p className="mb-4 text-sm text-slate-500">{text.statusHint}</p>
        <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
          {latestOrders.length ? latestOrders.map((order) => (
            <div key={order._id} className="rounded-[1.7rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold">{order.farmer?.name || text.farmer}</p>
                  <p className="mt-1 text-sm text-slate-500">{text.orderItems}: {order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{text.total}: Rs {order.totalAmount}</p>
                  <p className="mt-1 text-sm text-slate-500">{translateStatus(order.status, text)} • {translateStatus(order.paymentStatus, text)}</p>
                  <BuyerPaymentActions
                    order={order}
                    onPaid={() => {
                      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
                      queryClient.invalidateQueries({ queryKey: ["marketplace-products"] });
                    }}
                  />
                </div>
              </div>
            </div>
          )) : <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text.noOrders}</div>}
        </div>
      </section>
    </div>
  );
};
