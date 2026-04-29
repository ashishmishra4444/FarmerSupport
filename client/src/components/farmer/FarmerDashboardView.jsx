import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Info, Package2, TestTube2 } from "lucide-react";
import { orderApi, productApi, recommendationApi } from "../../services/api";
import { StatCard } from "../common/StatCard";
import { ProductForm } from "./ProductForm";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Link } from "react-router-dom";

const demoProfiles = {
  rice: { nitrogen: 73, phosphorus: 52, potassium: 48, ph: 6.8, location: "Odisha" },
  wheat: { nitrogen: 82, phosphorus: 64, potassium: 68, ph: 7.1, location: "Punjab" },
  cotton: { nitrogen: 58, phosphorus: 42, potassium: 62, ph: 7.3, location: "Gujarat" }
};
const copy = {
  en: {
    revenue: "Total Revenue",
    pending: "Pending Approvals",
    lowStock: "Low Stock Alerts",
    delivered: "Delivered Orders",
    aiTitle: "AI Crop Recommendation",
    aiIntro: "Use soil report values below. Empty fields will not generate a recommendation.",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    ph: "Soil pH",
    location: "Location",
    recommend: "Get Recommendation",
    riceExample: "Rice",
    wheatExample: "Wheat",
    cottonExample: "Cotton",
    aiResultTitle: "Best crop",
    aiHelperTitle: "How to read these values",
    aiHelperText: "N, P, and K are soil nutrients. pH shows acidity or alkalinity. Use sample buttons if you do not have a soil report yet.",
    myProducts: "My Products",
    noProducts: "No products added yet. Add your first crop above to make the marketplace active for buyers.",
    orderWorkflow: "Order Workflow",
    noOrders: "No buyer orders yet. After you add products, sign in as a buyer and place a test order.",
    buyerFallback: "Buyer",
    stock: "Stock",
    available: "Available",
    price: "Price",
    profileLocation: "Profile location",
    restock: "Restock",
    restockPlaceholder: "Enter stock to add",
    restockSaved: "Stock updated successfully.",
    invalidRestock: "Enter a positive stock quantity.",
    productSaved: "Product saved successfully.",
    statusSaved: "Order status updated successfully.",
    paid: "Paid",
    pendingLabel: "Pending approval",
    rejected: "Rejected",
    accept: "Accept",
    reject: "Reject",
    ship: "Ship",
    deliver: "Deliver",
    statusHelp: "Approve or reject the buyer request first. Payment starts only after you accept the order.",
    demoFlow: "Suggested farmer demo flow",
    demoFlowText: "Accept only when stock is available. Once accepted, the buyer gets Pay Now. Shipping is unlocked only after payment.",
    recommendationError: "Please enter all soil values before requesting a recommendation.",
    cannotAccept: "Insufficient stock",
    openRequest: "Open request",
    items: "items"
  },
  hi: {
    revenue: "कुल राजस्व",
    pending: "लंबित ऑर्डर",
    lowStock: "कम स्टॉक अलर्ट",
    delivered: "डिलीवर ऑर्डर",
    aiTitle: "एआई फसल सिफारिश",
    aiIntro: "नीचे मिट्टी रिपोर्ट के मान दर्ज करें। खाली फ़ील्ड पर सिफारिश नहीं बनेगी।",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फॉस्फोरस (P)",
    potassium: "पोटैशियम (K)",
    ph: "मिट्टी pH",
    location: "स्थान",
    recommend: "सिफारिश प्राप्त करें",
    riceExample: "धान",
    wheatExample: "गेहूं",
    cottonExample: "कपास",
    aiResultTitle: "सर्वश्रेष्ठ फसल",
    aiHelperTitle: "इन मानों को कैसे समझें",
    aiHelperText: "N, P और K मिट्टी के पोषक तत्व हैं। pH मिट्टी की अम्लता बताता है। रिपोर्ट न हो तो नमूना बटन से शुरू करें।",
    myProducts: "मेरे उत्पाद",
    noProducts: "अभी तक कोई उत्पाद नहीं जोड़ा गया। ऊपर अपनी पहली फसल जोड़ें।",
    orderWorkflow: "ऑर्डर वर्कफ़्लो",
    noOrders: "अभी तक कोई खरीदार ऑर्डर नहीं। उत्पाद जोड़ने के बाद खरीदार के रूप में टेस्ट ऑर्डर करें।",
    buyerFallback: "खरीदार",
    stock: "स्टॉक",
    available: "उपलब्ध",
    price: "कीमत",
    profileLocation: "प्रोफाइल लोकेशन",
    restock: "स्टॉक बढ़ाएँ",
    restockPlaceholder: "जोड़ने के लिए स्टॉक लिखें",
    restockSaved: "स्टॉक सफलतापूर्वक अपडेट हुआ।",
    invalidRestock: "सकारात्मक स्टॉक मात्रा दर्ज करें।",
    productSaved: "उत्पाद सफलतापूर्वक सेव हुआ।",
    statusSaved: "ऑर्डर स्टेटस सफलतापूर्वक अपडेट हुआ।",
    paid: "भुगतान हो चुका",
    pendingLabel: "लंबित",
    rejected: "अस्वीकृत",
    accept: "स्वीकार करें",
    reject: "अस्वीकार करें",
    ship: "शिप करें",
    deliver: "डिलीवर करें",
    statusHelp: "Pending का अर्थ है कि खरीदार ने अनुरोध भेजा है। स्टॉक पर्याप्त हो तभी स्वीकार करें।",
    demoFlow: "किसान डेमो फ्लो",
    demoFlowText: "अब स्टॉक केवल ऑर्डर स्वीकार करने के बाद घटेगा। यदि खरीदार उपलब्ध स्टॉक से अधिक माँगे तो ऑर्डर अस्वीकार करें।",
    recommendationError: "सिफारिश से पहले सभी मिट्टी मान दर्ज करें।",
    cannotAccept: "स्टॉक पर्याप्त नहीं",
    openRequest: "रिक्वेस्ट खोलें",
    items: "आइटम"
  },
  od: {
    revenue: "ମୋଟ ଆୟ",
    pending: "ଅପେକ୍ଷାରତ ଅର୍ଡର",
    lowStock: "କମ୍ ଷ୍ଟକ ସତର୍କତା",
    delivered: "ଡେଲିଭରି ଅର୍ଡର",
    aiTitle: "AI ଫସଲ ସୁପାରିଶ",
    aiIntro: "ନିମ୍ନରେ ମାଟି ରିପୋର୍ଟ ମାନ ଦିଅନ୍ତୁ। ଖାଲି ଫିଲ୍ଡରେ ସୁପାରିଶ ହେବ ନାହିଁ।",
    nitrogen: "ନାଇଟ୍ରୋଜେନ (N)",
    phosphorus: "ଫସ୍ଫୋରସ୍ (P)",
    potassium: "ପୋଟାସିଅମ୍ (K)",
    ph: "ମାଟି pH",
    location: "ସ୍ଥାନ",
    recommend: "ସୁପାରିଶ ପାଆନ୍ତୁ",
    riceExample: "ଧାନ",
    wheatExample: "ଗହମ",
    cottonExample: "କପାସ",
    aiResultTitle: "ସର୍ବୋତ୍ତମ ଫସଲ",
    aiHelperTitle: "ଏହି ମାନଗୁଡିକୁ କିପରି ବୁଝିବେ",
    aiHelperText: "N, P ଏବଂ K ମାଟିର ପୋଷକ। pH ମାଟିର ଆମ୍ଲତା/କ୍ଷାରତାକୁ ଦର୍ଶାଏ। ରିପୋର୍ଟ ନଥିଲେ ନମୁନା ବଟନ ବ୍ୟବହାର କରନ୍ତୁ।",
    myProducts: "ମୋ ପ୍ରଡକ୍ଟଗୁଡିକ",
    noProducts: "ଏଯାବତ୍ କୌଣସି ପ୍ରଡକ୍ଟ ଯୋଡାଯାଇନି। ଉପରେ ଆପଣଙ୍କ ପ୍ରଥମ ଫସଲ ଯୋଡନ୍ତୁ।",
    orderWorkflow: "ଅର୍ଡର ଫ୍ଲୋ",
    noOrders: "ଏଯାବତ୍ କୌଣସି କ୍ରେତା ଅର୍ଡର ନାହିଁ। ପ୍ରଡକ୍ଟ ଯୋଡିବା ପରେ ଟେଷ୍ଟ ଅର୍ଡର କରନ୍ତୁ।",
    buyerFallback: "କ୍ରେତା",
    stock: "ଷ୍ଟକ",
    available: "ଉପଲବ୍ଧ",
    price: "ଦର",
    profileLocation: "ପ୍ରୋଫାଇଲ ଲୋକେସନ",
    restock: "ଷ୍ଟକ ବଢାନ୍ତୁ",
    restockPlaceholder: "ଯୋଡିବାକୁ ଷ୍ଟକ ଦିଅନ୍ତୁ",
    restockSaved: "ଷ୍ଟକ ସଫଳତାର ସହ ଅପଡେଟ୍ ହେଲା।",
    invalidRestock: "ସକାରାତ୍ମକ ଷ୍ଟକ ପରିମାଣ ଦିଅନ୍ତୁ।",
    productSaved: "ପ୍ରଡକ୍ଟ ସଫଳତାର ସହ ସେଭ ହେଲା।",
    statusSaved: "ଅର୍ଡର ଷ୍ଟେଟସ ସଫଳତାର ସହ ଅପଡେଟ୍ ହେଲା।",
    paid: "ଭୁଗତାନ ହୋଇଛି",
    pendingLabel: "ଅପେକ୍ଷାରତ",
    rejected: "ଅସ୍ୱୀକୃତ",
    accept: "ଗ୍ରହଣ କରନ୍ତୁ",
    reject: "ଅସ୍ୱୀକାର କରନ୍ତୁ",
    ship: "ଶିପ୍ କରନ୍ତୁ",
    deliver: "ଡେଲିଭରି କରନ୍ତୁ",
    statusHelp: "Pending ଅର୍ଥ କ୍ରେତା ଅନୁରୋଧ କରିଛନ୍ତି। ଷ୍ଟକ ଯଥେଷ୍ଟ ଥିଲେ ମାତ୍ର ଗ୍ରହଣ କରନ୍ତୁ।",
    demoFlow: "କୃଷକ ଡେମୋ ଫ୍ଲୋ",
    demoFlowText: "ଏବେ ଷ୍ଟକ କେବଳ ଅର୍ଡର ଗ୍ରହଣ ପରେ କମିବ। ଉପଲବ୍ଧ ଷ୍ଟକଠାରୁ ଅଧିକ ମାଗିଲେ ଅର୍ଡର ଅସ୍ୱୀକାର କରନ୍ତୁ।",
    recommendationError: "ସୁପାରିଶ ପୂର୍ବରୁ ସମସ୍ତ ମାଟି ମାନ ଦିଅନ୍ତୁ।",
    cannotAccept: "ଷ୍ଟକ ପର୍ଯ୍ୟାପ୍ତ ନୁହେଁ",
    openRequest: "ଅନୁରୋଧ ଖୋଲନ୍ତୁ",
    items: "ଆଇଟମ୍"
  }
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

const workflowStatusPriority = {
  PendingApproval: 0,
  Accepted: 1,
  Shipped: 2,
  Delivered: 3,
  Rejected: 4
};

const buildBuyerOrderPath = (order) => {
  const buyerSlug = (order.buyer?.name || "buyer")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "buyer";

  return `/farmer/orders/${buyerSlug}/${order._id}`;
};

export const FarmerDashboardView = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const text = copy[i18n.language] || copy.en;
  const [soilForm, setSoilForm] = useState(demoProfiles.rice);
  const [recommendationError, setRecommendationError] = useState("");
  const [restockValues, setRestockValues] = useState({});

  const { data: summary } = useQuery({ queryKey: ["farmer-summary"], queryFn: productApi.summary });
  const { data: products } = useQuery({ queryKey: ["farmer-products"], queryFn: productApi.mine });
  const { data: orders } = useQuery({ queryKey: ["farmer-orders"], queryFn: orderApi.farmerOrders });
  const { data: analytics } = useQuery({ queryKey: ["farmer-order-analytics"], queryFn: orderApi.analytics });

  const createProduct = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      toast.success(text.productSaved);
      queryClient.invalidateQueries({ queryKey: ["farmer-products"] });
      queryClient.invalidateQueries({ queryKey: ["farmer-summary"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-products"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || text.recommendationError);
    }
  });

  const restockProduct = useMutation({
    mutationFn: ({ productId, stock }) => productApi.update(productId, { stock }),
    onSuccess: (_response, variables) => {
      toast.success(`${text.restockSaved} ${variables.productName}`);
      setRestockValues((current) => ({ ...current, [variables.productId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["farmer-products"] });
      queryClient.invalidateQueries({ queryKey: ["farmer-summary"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-products"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || text.invalidRestock);
    }
  });

  const cropRecommendation = useMutation({
    mutationFn: recommendationApi.predict,
    onError: (error) => {
      const message = error.response?.data?.message || text.recommendationError;
      setRecommendationError(message);
      toast.error(message);
    },
    onSuccess: () => setRecommendationError("")
  });

  const visibleProducts = products?.data || [];
  const visibleOrders = useMemo(
    () =>
      [...(orders?.data || [])]
        .sort((left, right) => {
          const priorityGap = (workflowStatusPriority[left.status] ?? 99) - (workflowStatusPriority[right.status] ?? 99);
          if (priorityGap !== 0) return priorityGap;
          return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
        })
        .slice(0, 12),
    [orders]
  );
  const farmerLocation = [user?.location?.district, user?.location?.state].filter(Boolean).join(", ");

  const handleRestock = (product) => {
    const increment = Number(restockValues[product._id] || 0);

    if (!Number.isInteger(increment) || increment <= 0) {
      toast.error(text.invalidRestock);
      return;
    }

    restockProduct.mutate({ productId: product._id, productName: product.name, stock: product.stock + increment });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard title={text.revenue} value={`Rs ${summary?.data?.totalRevenue || 0}`} />
        <StatCard title={text.pending} value={summary?.data?.pendingOrders || 0} />
        <StatCard title={text.lowStock} value={summary?.data?.lowStockCount || 0} />
        <StatCard title={text.delivered} value={analytics?.data?.deliveredOrders || 0} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <ProductForm onSubmit={(payload) => createProduct.mutate(payload)} loading={createProduct.isPending} farmerLocation={user?.location} />
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">{text.demoFlow}</p>
            <p className="mt-1 leading-6">{text.demoFlowText}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TestTube2 className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold">{text.aiTitle}</h2>
          </div>
          <p className="mt-3 text-sm text-slate-600">{text.aiIntro}</p>

          <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="h-4 w-4" />
              {text.aiHelperTitle}
            </div>
            <p className="mt-2 leading-6">{text.aiHelperText}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setSoilForm(demoProfiles.rice)} className="rounded-full border border-emerald-200 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50">{text.riceExample}</button>
            <button type="button" onClick={() => setSoilForm(demoProfiles.wheat)} className="rounded-full border border-emerald-200 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50">{text.wheatExample}</button>
            <button type="button" onClick={() => setSoilForm(demoProfiles.cotton)} className="rounded-full border border-emerald-200 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50">{text.cottonExample}</button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { key: "nitrogen", step: "1" },
              { key: "phosphorus", step: "1" },
              { key: "potassium", step: "1" },
              { key: "ph", step: "0.1" }
            ].map((field) => (
              <label key={field.key} className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">{text[field.key]}</span>
                <input type="number" step={field.step} className="rounded-2xl border p-3" placeholder={text[field.key]} value={soilForm[field.key]} onChange={(event) => setSoilForm({ ...soilForm, [field.key]: event.target.value })} />
              </label>
            ))}
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">{text.location}</span>
              <input className="rounded-2xl border p-3" placeholder={text.location} value={soilForm.location} onChange={(event) => setSoilForm({ ...soilForm, location: event.target.value })} />
            </label>
          </div>

          {recommendationError ? <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{recommendationError}</div> : null}

          <button type="button" onClick={() => cropRecommendation.mutate(soilForm)} className="mt-4 w-full rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300">
            {text.recommend}
          </button>

          {cropRecommendation.data ? (
            <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm">
              <p className="font-semibold text-emerald-800">{text.aiResultTitle}: {cropRecommendation.data.data.bestCrop}</p>
              <p className="mt-2 text-slate-600">{cropRecommendation.data.data.summary}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Package2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">{text.myProducts}</h2>
          </div>
          <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-800">{text.profileLocation}:</span> {farmerLocation || "-"}
          </div>
          <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
            {visibleProducts.length ? (visibleProducts.map((product) => (
              <div key={product._id} className="rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.cropType} • {product.unit || text.items}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                      <p className="text-sm text-slate-500">{text.price}</p>
                      <p className="text-xl font-semibold text-emerald-700">Rs {product.price}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 rounded-2xl border border-slate-100 bg-white/80 p-4 md:grid-cols-[0.75fr_1.25fr] md:items-center">
                    <div>
                      <p className="text-sm text-slate-500">{text.stock}</p>
                      <p className={`mt-1 text-lg font-semibold ${product.stock === 0 ? "text-rose-600" : "text-emerald-700"}`}>{product.stock}</p>
                      <p className="mt-2 text-sm text-slate-600">{text.available}: {product.stock} {product.unit || text.items}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                      <input
                        type="number"
                        min="1"
                        value={restockValues[product._id] || ""}
                        onChange={(event) => setRestockValues((current) => ({ ...current, [product._id]: event.target.value }))}
                        placeholder={text.restockPlaceholder}
                        className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleRestock(product)}
                        disabled={restockProduct.isPending}
                        className="rounded-full border border-emerald-200 px-4 py-3 text-sm text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {text.restock}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text.noProducts}</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">{text.orderWorkflow}</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500">{text.statusHelp}</p>
          <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
            {visibleOrders.length ? (visibleOrders.map((order) => {
              return (
                <div key={order._id} className={`rounded-[1.8rem] border p-5 shadow-[0_14px_32px_rgba(15,23,42,0.06)] ${statusTone[order.status] || "border-slate-200 bg-white"}`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xl font-semibold text-slate-900">{order.buyer?.name || text.buyerFallback}</p>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                          {order.items.map((item) => (
                            <p key={item.productName}>{item.productName} x{item.quantity} • {text.available}: {item.product?.stock ?? 0}</p>
                          ))}
                        </div>
                        <p className="mt-3 text-sm text-slate-500">Rs {order.totalAmount} • {order.paymentStatus === "Paid" ? text.paid : order.paymentStatus === "AwaitingPayment" ? "Awaiting payment" : "Unpaid"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={buildBuyerOrderPath(order)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                          {text.openRequest}
                        </Link>
                        <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-slate-800">{statusLabel(order.status, text)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text.noOrders}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};