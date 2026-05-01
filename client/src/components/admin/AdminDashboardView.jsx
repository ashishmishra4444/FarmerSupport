// import { useQuery } from "@tanstack/react-query";
// import { Activity, BarChart3, DatabaseZap, Users } from "lucide-react";
// import { BarChart, Bar, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { adminApi } from "../../services/api";
// import { StatCard } from "../common/StatCard";
// import { LoadingCard } from "../common/LoadingCard";
// import { useTranslation } from "react-i18next";

// const copy = {
//   en: {
//     users: "Users",
//     products: "Products",
//     orders: "Orders",
//     farmers: "Farmers",
//     sales: "Sales Trends",
//     volume: "Order Volume",
//     mandi: "Latest Mandi Prices",
//     emptyPrices: "Live mandi rows will appear here automatically after sync or first fetch.",
//     adminTip: "Admin dashboard shows total platform users, listed products, total orders, sales growth, order volume, and mandi price visibility.",
//     platformHealth: "Platform health",
//     healthText: "Use this page to monitor growth, see whether marketplace activity is increasing, and validate that live mandi data is reaching the platform."
//   },
//   hi: {
//     users: "उपयोगकर्ता",
//     products: "उत्पाद",
//     orders: "ऑर्डर",
//     farmers: "किसान",
//     sales: "बिक्री रुझान",
//     volume: "ऑर्डर वॉल्यूम",
//     mandi: "ताज़ा मंडी भाव",
//     emptyPrices: "लाइव मंडी पंक्तियाँ सिंक या पहली फेच के बाद यहाँ दिखेंगी।",
//     adminTip: "एडमिन डैशबोर्ड कुल उपयोगकर्ता, उत्पाद, ऑर्डर, बिक्री वृद्धि और मंडी दृश्यता दिखाता है।",
//     platformHealth: "प्लेटफॉर्म स्वास्थ्य",
//     healthText: "इस पेज से वृद्धि, मार्केटप्लेस गतिविधि और लाइव मंडी डेटा की स्थिति देखें।"
//   },
//   od: {
//     users: "ଉପଯୋଗକର୍ତ୍ତା",
//     products: "ପ୍ରଡକ୍ଟଗୁଡିକ",
//     orders: "ଅର୍ଡରଗୁଡିକ",
//     farmers: "କୃଷକମାନେ",
//     sales: "ବିକ୍ରୟ ଧାରା",
//     volume: "ଅର୍ଡର ପରିମାଣ",
//     mandi: "ସେଷ ମଣ୍ଡି ଦର",
//     emptyPrices: "ଲାଇଭ ମଣ୍ଡି ତଥ୍ୟ ସିଙ୍କ କିମ୍ବା ପ୍ରଥମ ଫେଚ୍ ପରେ ଏଠାରେ ଦେଖାଯିବ।",
//     adminTip: "ଏଡମିନ ଡ୍ୟାଶବୋର୍ଡରେ ମୋଟ ଉପଯୋଗକର୍ତ୍ତା, ପ୍ରଡକ୍ଟ, ଅର୍ଡର, ବିକ୍ରୟ ଓ ମଣ୍ଡି ଦୃଶ୍ୟତା ଦେଖାଯାଏ।",
//     platformHealth: "ପ୍ଲାଟଫର୍ମ ସ୍ୱାସ୍ଥ୍ୟ",
//     healthText: "ଏହି ପୃଷ୍ଠାରୁ ବୃଦ୍ଧି, ମାର୍କେଟପ୍ଲେସ କାର୍ଯ୍ୟକଳାପ ଏବଂ ଲାଇଭ ମଣ୍ଡି ଡାଟା ଯାଞ୍ଚ କରନ୍ତୁ।"
//   }
// };

// export const AdminDashboardView = () => {
//   const { data: dashboard, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminApi.dashboard });
//   const { data: snapshot } = useQuery({ queryKey: ["admin-snapshot"], queryFn: adminApi.snapshot });
//   const { i18n } = useTranslation();
//   const text = copy[i18n.language] || copy.en;

//   if (isLoading) {
//     return (
//       <div className="grid gap-4 md:grid-cols-3">
//         <LoadingCard />
//         <LoadingCard />
//         <LoadingCard />
//       </div>
//     );
//   }

//   const roleMap = Object.fromEntries((dashboard?.data?.userStats || []).map((item) => [item._id, item.count]));

//   return (
//     <div className="space-y-8">
//       <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">{text.adminTip}</div>

//       <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//           <StatCard title={text.users} value={snapshot?.data?.users || 0} />
//           <StatCard title={text.products} value={snapshot?.data?.products || 0} />
//           <StatCard title={text.orders} value={snapshot?.data?.orders || 0} />
//           <StatCard title={text.farmers} value={roleMap.Farmer || 0} />
//         </div>

//         <div className="rounded-3xl bg-white p-5 shadow-sm">
//           <div className="flex items-center gap-2">
//             <Activity className="h-5 w-5 text-emerald-600" />
//             <h2 className="text-lg font-semibold">{text.platformHealth}</h2>
//           </div>
//           <p className="mt-3 text-sm leading-6 text-slate-600">{text.healthText}</p>
//           <div className="mt-4 grid gap-3 sm:grid-cols-3">
//             <div className="rounded-2xl bg-emerald-50 p-4">
//               <Users className="h-5 w-5 text-emerald-700" />
//               <p className="mt-2 text-sm text-slate-600">Accounts are being created and tracked.</p>
//             </div>
//             <div className="rounded-2xl bg-sky-50 p-4">
//               <BarChart3 className="h-5 w-5 text-sky-700" />
//               <p className="mt-2 text-sm text-slate-600">Sales and order charts reveal platform activity trends.</p>
//             </div>
//             <div className="rounded-2xl bg-amber-50 p-4">
//               <DatabaseZap className="h-5 w-5 text-amber-700" />
//               <p className="mt-2 text-sm text-slate-600">Mandi prices are designed to refresh dynamically via sync.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="grid gap-6 lg:grid-cols-2">
//         <div className="rounded-3xl bg-white p-5 shadow-sm">
//           <h2 className="mb-4 text-lg font-semibold">{text.sales}</h2>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={dashboard?.data?.salesStats || []}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="_id" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="rounded-3xl bg-white p-5 shadow-sm">
//           <h2 className="mb-4 text-lg font-semibold">{text.volume}</h2>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={dashboard?.data?.salesStats || []}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="_id" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="orders" fill="#f59e0b" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>

//       <section className="rounded-3xl bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold">{text.mandi}</h2>
//         <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
//           {(dashboard?.data?.latestPrices || []).length ? (dashboard.data.latestPrices.map((price) => (
//             <div key={price._id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
//               <div>
//                 <p className="font-medium">{price.crop}</p>
//                 <p className="text-sm text-slate-500">{price.market}, {price.state}</p>
//               </div>
//               <p className="text-lg font-semibold text-emerald-700">Rs {price.modalPrice}</p>
//             </div>
//           ))) : (
//             <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text.emptyPrices}</div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, BarChart3, DatabaseZap, Users, Megaphone, Trash2 } from "lucide-react";
import { BarChart, Bar, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminApi, announcementApi } from "../../services/api";
import { StatCard } from "../common/StatCard";
import { LoadingCard } from "../common/LoadingCard";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";

const copy = {
  en: {
    users: "Users",
    products: "Products",
    orders: "Orders",
    farmers: "Farmers",
    sales: "Sales Trends",
    volume: "Order Volume",
    mandi: "Latest Mandi Prices",
    emptyPrices: "Live mandi rows will appear here automatically after sync or first fetch.",
    adminTip: "Admin dashboard shows total platform users, listed products, total orders, sales growth, order volume, and mandi price visibility.",
    platformHealth: "Platform health",
    healthText: "Use this page to monitor growth, see whether marketplace activity is increasing, and validate that live mandi data is reaching the platform.",
    broadcast: "Broadcast Announcements",
    postMessage: "Post Message",
    writeMessage: "Write an announcement to all users...",
    noAnnouncements: "No active announcements."
  },
  hi: {
    users: "उपयोगकर्ता",
    products: "उत्पाद",
    orders: "ऑर्डर",
    farmers: "किसान",
    sales: "बिक्री रुझान",
    volume: "ऑर्डर वॉल्यूम",
    mandi: "ताज़ा मंडी भाव",
    emptyPrices: "लाइव मंडी पंक्तियाँ सिंक या पहली फेच के बाद यहाँ दिखेंगी।",
    adminTip: "एडमिन डैशबोर्ड कुल उपयोगकर्ता, उत्पाद, ऑर्डर, बिक्री वृद्धि और मंडी दृश्यता दिखाता है।",
    platformHealth: "प्लेटफॉर्म स्वास्थ्य",
    healthText: "इस पेज से वृद्धि, मार्केटप्लेस गतिविधि और लाइव मंडी डेटा की स्थिति देखें।",
    broadcast: "घोषणाएं प्रसारित करें",
    postMessage: "संदेश भेजें",
    writeMessage: "सभी उपयोगकर्ताओं के लिए एक घोषणा लिखें...",
    noAnnouncements: "कोई सक्रिय घोषणा नहीं।"
  },
  od: {
    users: "ଉପଯୋଗକର୍ତ୍ତା",
    products: "ପ୍ରଡକ୍ଟଗୁଡିକ",
    orders: "ଅର୍ଡରଗୁଡିକ",
    farmers: "କୃଷକମାନେ",
    sales: "ବିକ୍ରୟ ଧାରା",
    volume: "ଅର୍ଡର ପରିମାଣ",
    mandi: "ସେଷ ମଣ୍ଡି ଦର",
    emptyPrices: "ଲାଇଭ ମଣ୍ଡି ତଥ୍ୟ ସିଙ୍କ କିମ୍ବା ପ୍ରଥମ ଫେଚ୍ ପରେ ଏଠାରେ ଦେଖାଯିବ।",
    adminTip: "ଏଡମିନ ଡ୍ୟାଶବୋର୍ଡରେ ମୋଟ ଉପଯୋଗକର୍ତ୍ତା, ପ୍ରଡକ୍ଟ, ଅର୍ଡର, ବିକ୍ରୟ ଓ ମଣ୍ଡି ଦୃଶ୍ୟତା ଦେଖାଯାଏ।",
    platformHealth: "ପ୍ଲାଟଫର୍ମ ସ୍ୱାସ୍ଥ୍ୟ",
    healthText: "ଏହି ପୃଷ୍ଠାରୁ ବୃଦ୍ଧି, ମାର୍କେଟପ୍ଲେସ କାର୍ଯ୍ୟକଳାପ ଏବଂ ଲାଇଭ ମଣ୍ଡି ଡାଟା ଯାଞ୍ଚ କରନ୍ତୁ।",
    broadcast: "ପ୍ରସାରଣ ଘୋଷଣା",
    postMessage: "ମେସେଜ୍ ପଠାନ୍ତୁ",
    writeMessage: "ସମସ୍ତ ବ୍ୟବହାରକାରୀଙ୍କ ପାଇଁ ଏକ ଘୋଷଣା ଲେଖନ୍ତୁ...",
    noAnnouncements: "କୌଣସି ସକ୍ରିୟ ଘୋଷଣା ନାହିଁ।"
  }
};

export const AdminDashboardView = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [message, setMessage] = useState("");
  
  const { data: dashboard, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminApi.dashboard });
  const { data: snapshot } = useQuery({ queryKey: ["admin-snapshot"], queryFn: adminApi.snapshot });
  const { data: announcements } = useQuery({ queryKey: ["announcements"], queryFn: announcementApi.list });
  
  const { i18n } = useTranslation();
  const text = copy[i18n.language] || copy.en;

  const createAnnouncement = useMutation({
    mutationFn: announcementApi.create,
    onSuccess: () => {
      toast.success("Announcement posted");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    }
  });

  const deleteAnnouncement = useMutation({
    mutationFn: announcementApi.remove,
    onSuccess: () => {
      toast.success("Announcement deleted");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    }
  });

  const handlePost = (e) => {
    e.preventDefault();
    if (message.trim()) {
      createAnnouncement.mutate({ message });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  const roleMap = Object.fromEntries((dashboard?.data?.userStats || []).map((item) => [item._id, item.count]));
  const activeAnnouncements = announcements?.data || [];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">{text.adminTip}</div>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title={text.users} value={snapshot?.data?.users || 0} />
          <StatCard title={text.products} value={snapshot?.data?.products || 0} />
          <StatCard title={text.orders} value={snapshot?.data?.orders || 0} />
          <StatCard title={text.farmers} value={roleMap.Farmer || 0} />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">{text.platformHealth}</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{text.healthText}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <Users className="h-5 w-5 text-emerald-700" />
              <p className="mt-2 text-sm text-slate-600">Accounts are being created and tracked.</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <BarChart3 className="h-5 w-5 text-sky-700" />
              <p className="mt-2 text-sm text-slate-600">Sales and order charts reveal platform activity trends.</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <DatabaseZap className="h-5 w-5 text-amber-700" />
              <p className="mt-2 text-sm text-slate-600">Mandi prices are designed to refresh dynamically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW BROADCAST SECTION */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">{text.broadcast}</h2>
          </div>
          <form onSubmit={handlePost} className="mb-6 flex gap-3">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={text.writeMessage}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 outline-none focus:border-indigo-400"
            />
            <button 
              type="submit" 
              disabled={createAnnouncement.isPending || !message.trim()}
              className="rounded-full bg-indigo-600 px-5 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {text.postMessage}
            </button>
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {activeAnnouncements.length ? activeAnnouncements.map((ann) => (
              <div key={ann._id} className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="text-sm font-medium text-slate-800">{ann.message}</p>
                <button 
                  onClick={() => deleteAnnouncement.mutate(ann._id)}
                  disabled={deleteAnnouncement.isPending}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 text-center">
                {text.noAnnouncements}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{text.mandi}</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {(dashboard?.data?.latestPrices || []).length ? (dashboard.data.latestPrices.map((price) => (
              <div key={price._id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div>
                  <p className="font-medium">{price.crop}</p>
                  <p className="text-sm text-slate-500">{price.market}, {price.state}</p>
                </div>
                <p className="text-lg font-semibold text-emerald-700">Rs {price.modalPrice}</p>
              </div>
            ))) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">{text.emptyPrices}</div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{text.sales}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboard?.data?.salesStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{text.volume}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard?.data?.salesStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};