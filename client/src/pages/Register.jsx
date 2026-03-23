import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";

export const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Farmer",
    location: {
      district: "",
      state: ""
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.location.district || !form.location.state) {
      const message = t("requiredFields");
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setSubmitting(true);
      const response = await authApi.register(form);
      setUser(response.data);
      toast.success(`${response.data.role} account created successfully. Welcome, ${response.data.name}.`);
      navigate(response.data.role === "Admin" ? "/admin" : response.data.role === "Farmer" ? "/farmer" : "/buyer");
    } catch (apiError) {
      const message = apiError.response?.data?.message || t("registerError");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
      <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#064e3b_0%,#065f46_45%,#0f766e_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div className="flex h-full flex-col justify-between gap-8">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-emerald-50">{t("registerBadge")}</p>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">{t("registerHeroTitle")}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/90 sm:text-base">{t("registerHeroText")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="overflow-hidden rounded-[1.5rem] bg-white/10 backdrop-blur">
              <img src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=900&q=80" alt="Farmer market" className="h-32 w-full object-cover" />
              <div className="p-4">
                <p className="text-sm text-emerald-100">{t("farmerRole")}</p>
                <p className="mt-2 text-lg font-semibold">{t("farmerRoleText")}</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] bg-white/10 backdrop-blur">
              <img src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80" alt="Buyer and produce" className="h-32 w-full object-cover" />
              <div className="p-4">
                <p className="text-sm text-emerald-100">{t("buyerRole")}</p>
                <p className="mt-2 text-lg font-semibold">{t("buyerRoleText")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{t("createAccount")}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">{t("registerIntro")}</p>
        </div>

        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">{t("fullName")}</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" placeholder={t("enterFullName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">{t("email")}</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" type="email" placeholder={t("enterEmail")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">{t("password")}</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" type="password" placeholder={t("minPassword")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">{t("role")}</span>
            <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="Farmer">{t("farmerRole")}</option>
              <option value="Buyer">{t("buyerRole")}</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">{t("district")}</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" placeholder={t("enterDistrict")} value={form.location.district} onChange={(e) => setForm({ ...form, location: { ...form.location, district: e.target.value } })} />
          </label>
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">{t("state")}</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" placeholder={t("enterState")} value={form.location.state} onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })} />
          </label>
          {error ? <p className="md:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          <button type="submit" disabled={submitting} className="md:col-span-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? t("creatingAccount") : t("createAccount")}
          </button>
        </form>
      </div>
    </motion.section>
  );
};
