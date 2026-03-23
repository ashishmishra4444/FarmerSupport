import { Link } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, CloudSun, ShieldCheck, Tractor, TrendingUp, Wheat } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const quickStatValues = ["24 markets", "7 day alerts", "18 crops"];
const quickStatValuesHi = ["24 मंडियाँ", "7 दिन अलर्ट", "18 फसलें"];
const quickStatValuesOd = ["24 ମଣ୍ଡି", "7 ଦିନ ସତର୍କତା", "18 ଫସଲ"];

const riseIn = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const Home = () => {
  const { t, i18n } = useTranslation();
  const statValues = i18n.language === "hi" ? quickStatValuesHi : i18n.language === "od" ? quickStatValuesOd : quickStatValues;
  const supportPillars = [
    { title: t("supportTitle1"), text: t("supportText1"), icon: Wheat },
    { title: t("supportTitle2"), text: t("supportText2"), icon: TrendingUp },
    { title: t("supportTitle3"), text: t("supportText3"), icon: CloudSun },
    { title: t("supportTitle4"), text: t("supportText4"), icon: ShieldCheck }
  ];

  return (
    <div className="space-y-10 lg:space-y-14">
      <motion.section {...riseIn} className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_24px_90px_rgba(6,78,59,0.08)]">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(254,240,138,0.35),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.16),_transparent_36%)]" />
            <div className="relative">
              <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.45 }} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                <Tractor className="h-4 w-4" />
                {t("homeBadge")}
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.5 }} className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {t("homeTitle")}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }} className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {t("welcome")} {t("homeDescription")}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.5 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                  {t("createFarmerAccount")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700">
                  {t("signInDashboard")}
                </Link>
              </motion.div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  t("quickStatMarkets"),
                  t("quickStatWeather"),
                  t("quickStatDemand")
                ].map((label, index) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.08, duration: 0.45 }} className="rounded-3xl border border-emerald-100 bg-white/80 p-4 backdrop-blur">
                    <p className="text-xl font-semibold text-slate-900">{statValues[index]}</p>
                    <p className="mt-1 text-sm text-slate-500">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22, duration: 0.55 }} className="relative min-h-[420px] overflow-hidden bg-[linear-gradient(180deg,#ecfdf5_0%,#f0fdf4_42%,#dcfce7_100%)] p-5 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_34%)]" />
            <div className="relative flex h-full flex-col justify-between gap-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
                  <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80" alt="Green farmland" className="h-44 w-full object-cover sm:h-52" />
                  <div className="p-4">
                    <p className="text-sm font-semibold text-slate-900">{t("homeCard1Title")}</p>
                    <p className="mt-1 text-sm text-slate-500">{t("homeCard1Text")}</p>
                  </div>
                </div>

                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }} className="rounded-[1.75rem] bg-emerald-950 p-5 text-white shadow-sm">
                  <div className="flex items-center justify-between text-emerald-100">
                    <span className="text-sm">{t("homePulseTitle")}</span>
                    <BadgeIndianRupee className="h-5 w-5" />
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-sm text-emerald-100">{t("homePulseCrop")}</p>
                      <p className="mt-1 text-2xl font-semibold">Rs 2,450</p>
                      <p className="mt-1 text-xs text-emerald-200">{t("homePulseCropSub")}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-sm text-emerald-100">{t("homePulseRain")}</p>
                      <p className="mt-1 text-lg font-semibold">{t("homePulseRainText")}</p>
                      <p className="mt-1 text-xs text-emerald-200">{t("homePulseRainSub")}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-slate-900">{t("builtForTitle")}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t("builtForText")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {supportPillars.map((item, index) => (
          <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08, duration: 0.45 }} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <item.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
};
