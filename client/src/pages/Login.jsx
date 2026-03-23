import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, setAuthToken } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      const message = t("loginRequired");
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setSubmitting(true);
      const response = await authApi.login(form);
      setAuthToken(response.token);
      setUser(response.data);
      toast.success(`${response.data.role} login successful. Welcome back, ${response.data.name}.`);
      navigate(response.data.role === "Admin" ? "/admin" : response.data.role === "Farmer" ? "/farmer" : "/buyer");
    } catch (apiError) {
      const message = apiError.response?.data?.message || t("loginError");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
      <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#1e3a8a_0%,#0f766e_100%)] p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div className="flex h-full flex-col justify-between gap-8">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-sky-50">{t("loginBadge")}</p>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">{t("loginHeroTitle")}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-sky-50/90 sm:text-base">{t("loginHeroText")}</p>
          </div>

          <motion.img animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80" alt="Farmer in field" className="h-56 w-full rounded-[1.5rem] object-cover" />
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg sm:p-8 lg:p-10">
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{t("login")}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">{t("loginIntro")}</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">{t("email")}</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" type="email" placeholder={t("enterEmail")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">{t("password")}</span>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400" type="password" placeholder={t("password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          <button type="submit" disabled={submitting} className="w-full rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? t("signingIn") : t("signIn")}
          </button>
        </form>
      </div>
    </motion.section>
  );
};




