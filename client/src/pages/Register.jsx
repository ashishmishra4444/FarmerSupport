import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, setAuthToken } from "../services/api";
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
      state: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.location.district ||
      !form.location.state
    ) {
      const message = t("requiredFields");
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setSubmitting(true);

      const response = await authApi.register(form);

      setAuthToken(response.token);
      setUser(response.data);

      toast.success(
        `${response.data.role} account created successfully. Welcome, ${response.data.name}.`
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
        apiError.response?.data?.message || t("registerError");

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
                Farmer Support Platform
              </p>

              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Grow better with smarter farming tools.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#d7d3c8] sm:text-base">
                Create your account to access mandi prices, weather alerts,
                crop planning insights, secure buyers, and seamless farming
                support.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-[#d7d3c8]">
                  Daily Prices
                </p>
                <h3 className="mt-3 text-xl font-semibold text-[#f9f3df]">
                  Live mandi insights
                </h3>
                <p className="mt-2 text-sm text-[#d7d3c8]">
                  Compare markets and sell produce at better prices.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-[#d7d3c8]">
                  Smart Alerts
                </p>
                <h3 className="mt-3 text-xl font-semibold text-[#f9f3df]">
                  Weather readiness
                </h3>
                <p className="mt-2 text-sm text-[#d7d3c8]">
                  Get local forecasts for sowing, harvest and transport.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="rounded-[2rem] border border-[#ddd2b6] bg-[#fcfaf4] p-6 shadow-xl sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8a7d5a]">
              Join Platform
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[#102a1d] sm:text-4xl">
              {t("createAccount")}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5f665b] sm:text-base">
              Register as a farmer, buyer, or admin and start managing your
              agricultural ecosystem with confidence.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Name */}
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#1d2b1f]">
                {t("fullName")}
              </span>
              <input
                type="text"
                placeholder={t("enterFullName")}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              />
            </label>

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
                className="rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              />
            </label>

            {/* Password */}
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#1d2b1f]">
                {t("password")}
              </span>
              <input
                type="password"
                placeholder={t("minPassword")}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              />
            </label>

            {/* Role */}
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#1d2b1f]">
                {t("role")}
              </span>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              >
                <option value="Farmer">{t("farmerRole")}</option>
                <option value="Buyer">{t("buyerRole")}</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            {/* District */}
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#1d2b1f]">
                {t("district")}
              </span>
              <input
                type="text"
                placeholder={t("enterDistrict")}
                value={form.location.district}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: {
                      ...form.location,
                      district: e.target.value,
                    },
                  })
                }
                className="rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              />
            </label>

            {/* State */}
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#1d2b1f]">
                {t("state")}
              </span>
              <input
                type="text"
                placeholder={t("enterState")}
                value={form.location.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: {
                      ...form.location,
                      state: e.target.value,
                    },
                  })
                }
                className="rounded-2xl border border-[#ddd2b6] bg-white px-4 py-3 outline-none transition focus:border-[#123524] focus:ring-2 focus:ring-[#ddd2b6]"
              />
            </label>

            {/* Error */}
            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#123524] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d4d2b] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
            >
              {submitting
                ? t("creatingAccount")
                : t("createAccount")}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-[#5f665b] md:col-span-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-[#123524] hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </motion.section>
  );
};