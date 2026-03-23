import { Link, useNavigate } from "react-router-dom";
import { Languages, Leaf, LogOut, Menu, Sprout, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dashboardPath =
    user?.role === "Admin"
      ? "/admin"
      : user?.role === "Farmer"
        ? "/farmer"
        : user?.role === "Buyer"
          ? "/buyer"
          : "/";

  const userName = user?.name?.trim() || "User";
  const userInitial = userName.charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (_error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setOpen(false);
      setProfileOpen(false);
    }
  };

  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease: "easeOut" }} className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3 text-emerald-950">
            <div className="rounded-2xl bg-emerald-600 p-2.5 text-white shadow-lg shadow-emerald-200">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold sm:text-lg">{t("appName")}</p>
              <p className="hidden text-xs text-slate-500 sm:block">{t("navTagline")}</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <label className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm shadow-sm">
              <Languages className="h-4 w-4 text-emerald-600" />
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="bg-transparent outline-none">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="od">Odia</option>
              </select>
            </label>

            {user ? (
              <>
                <Link to={dashboardPath} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700">Dashboard</Link>
                <div
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setProfileOpen((current) => !current)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                    aria-label={userName}
                    aria-expanded={profileOpen}
                  >
                    {userInitial}
                  </button>
                  <AnimatePresence>
                    {profileOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-[calc(100%+0.35rem)] z-50 w-56 rounded-3xl border border-emerald-100 bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
                      >
                        <p className="text-sm text-slate-500">Signed in as</p>
                        <p className="mt-1 break-words text-base font-semibold text-slate-900">{userName}</p>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("logout")}
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-emerald-700">{t("login")}</Link>
                <Link to="/register" className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-300">
                  <Sprout className="h-4 w-4" />
                  {t("register")}
                </Link>
              </>
            )}
          </div>

          <button type="button" onClick={() => setOpen((current) => !current)} className="rounded-2xl border border-slate-200 p-2 text-slate-700 md:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="mt-4 space-y-3 rounded-3xl border border-emerald-100 bg-white p-4 md:hidden">
              <label className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3 py-3 text-sm shadow-sm">
                <Languages className="h-4 w-4 text-emerald-600" />
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full bg-transparent outline-none">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="od">Odia</option>
                </select>
              </label>

              {user ? (
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Profile</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-emerald-700 shadow-sm">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                        <p className="text-xs text-slate-500">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  <Link to={dashboardPath} onClick={() => setOpen(false)} className="rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white">Dashboard</Link>
                  <button type="button" onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700">{t("login")}</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="rounded-2xl bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-slate-900">{t("register")}</Link>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
