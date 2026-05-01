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

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

      toast.success(
        `${response.data.role} login successful. Welcome back, ${response.data.name}.`
      );

      navigate(
        response.data.role === "Admin"
          ? "/admin"
          : response.data.role === "Farmer"
          ? "/farmer"
          : "/buyer"
      );
    } catch (apiError) {
      const message =
        apiError.response?.data?.message || t("loginError");

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-[#f6f1e7] px-4 py-6 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.05fr]">
        {/* LEFT HERO PANEL */}
        <div className="overflow-hidden rounded-[2rem] bg-[#123524] text-white shadow-xl">
          <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#efe7d0]">
                Welcome Back
              </p>

              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Access your smart farming dashboard.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#d7d3c8] sm:text-base">
                Sign in to monitor crops, view mandi prices, connect with buyers,
                receive alerts, and manage your farm operations easily.
              </p>
            </div>

            {/* Animated Image */}
            <motion.img
              animate={{ scale: [1, 1.03, 1] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80"
              alt="Farmer in field"
              className="h-64 w-full rounded-[1.8rem] object-cover"
            />
          </div>
        </div>

        {/* RIGHT LOGIN PANEL */}
        <div className="rounded-[2rem] border border-[#ddd2b6] bg-[#fcfaf4] p-6 shadow-xl sm:p-8 lg:p-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8a7d5a]">
              Secure Access
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[#102a1d] sm:text-4xl">
              {t("login")}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5f665b] sm:text-base">
              Sign in to continue using your premium agricultural workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#1d2b1f]">
                {t("email")}
              </span>

              <input
                type="email"
                placeholder={t("enterEmail")}
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              />
            </label>

            {/* Password */}
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#1d2b1f]">
                {t("password")}
              </span>

              <input
                type="password"
                placeholder={t("password")}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              />
            </label>

            {/* Error */}
            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#123524] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d4d2b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? t("signingIn") : t("signIn")}
            </button>

            {/* Register Link */}
            <p className="pt-2 text-center text-sm text-[#5f665b]">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-[#123524] hover:underline"
              >
                Create account
              </button>
            </p>
          </form>
        </div>
      </div>
    </motion.section>
  );
};