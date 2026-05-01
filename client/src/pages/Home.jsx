import { Link } from "react-router-dom";
import { ArrowUpRight, Sprout, BarChart3, CloudRain, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const quickStatValues   = ["24 markets", "7-day alerts", "18 crops"];
const quickStatValuesHi = ["24 मंडियाँ",  "7 दिन अलर्ट",   "18 फसलें"];
const quickStatValuesOd = ["24 ମଣ୍ଡି",    "7 ଦିନ ସତର୍କତା", "18 ଫସଲ"];

const fade     = (delay = 0) => ({ initial: { opacity: 0, y: 18 }, animate:     { opacity: 1, y: 0 }, transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] } });
const fadeView = (delay = 0) => ({ initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] } });

export const Home = () => {
  const { t, i18n } = useTranslation();

  const statValues =
    i18n.language === "hi" ? quickStatValuesHi :
    i18n.language === "od" ? quickStatValuesOd :
    quickStatValues;

  const pillars = [
    { title: t("supportTitle1"), text: t("supportText1"), icon: Sprout,      num: "01" },
    { title: t("supportTitle2"), text: t("supportText2"), icon: BarChart3,   num: "02" },
    { title: t("supportTitle3"), text: t("supportText3"), icon: CloudRain,   num: "03" },
    { title: t("supportTitle4"), text: t("supportText4"), icon: ShieldCheck, num: "04" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .hr { font-family: 'DM Sans', sans-serif; color: #0e1a0f; }

        /* ── hero ── */
        .hero { background: #f5f2eb; position: relative; overflow: hidden; }
        .hero-body {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
        }
        .hero-img-col { display: none; }

        .hero-left {
          padding: 1.75rem 1.25rem 1.5rem;
          display: flex; flex-direction: column; gap: 1.25rem;
        }

        .hero-h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.9rem, 7vw, 2.8rem);
          line-height: 1.06; font-weight: 400; color: #0e1a0f; margin: 0;
        }
        .hero-badge {
          font-size: 10px; letter-spacing: 0.17em;
          text-transform: uppercase; color: #4a7c59; font-weight: 500; margin: 0;
        }
        .hero-desc {
          font-size: 0.875rem; line-height: 1.65;
          color: #3d5c42; font-weight: 300; margin: 0; max-width: 44ch;
        }

        .cta-row { display: flex; gap: 0.65rem; flex-wrap: wrap; align-items: center; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 5px;
          background: #1a2e1b; color: #f5f2eb;
          padding: 0.65rem 1.35rem; border-radius: 999px;
          font-size: 0.82rem; font-weight: 500; letter-spacing: 0.02em;
          text-decoration: none; transition: background 0.2s, transform 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .btn-primary:hover { background: #2d5230; transform: translateY(-2px); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 5px;
          background: transparent; color: #1a2e1b;
          padding: 0.65rem 1.35rem; border-radius: 999px;
          font-size: 0.82rem; font-weight: 500;
          border: 1px solid #1a2e1b50;
          text-decoration: none; transition: border-color 0.2s, transform 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .btn-ghost:hover { border-color: #1a2e1b; transform: translateY(-2px); }

        .stat-strip {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #1a2e1b1a; padding-top: 1.1rem; gap: 0.5rem;
        }
        .stat-val {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.05rem, 3vw, 1.4rem); color: #1a2e1b; margin: 0;
        }
        .stat-label { font-size: 10px; color: #5a7a5e; margin-top: 2px; letter-spacing: 0.03em; }

        /* image col */
        .hero-img-inner { position: relative; height: 100%; }
        .pulse-card {
          position: absolute; bottom: 1rem; left: 1rem; right: 1rem;
          background: rgba(14,26,15,0.84); backdrop-filter: blur(14px);
          border-radius: 14px; padding: 0.9rem 1.1rem;
          color: #f5f2eb; border: 1px solid rgba(255,255,255,0.07);
        }
        .pulse-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem; }
        .pulse-label  { font-size: 10px; letter-spacing: 0.13em; text-transform: uppercase; color: #8fb897; }
        .pulse-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; }
        .pulse-cell   { background: rgba(255,255,255,0.07); border-radius: 9px; padding: 0.6rem 0.75rem; }
        .pulse-cell-label { font-size: 9px; color: #8fb897; margin-bottom: 2px; }
        .pulse-cell-val   { font-family: 'DM Serif Display', serif; font-size: 1.2rem; line-height: 1; }
        .pulse-cell-sub   { font-size: 9px; color: #6a9470; margin-top: 2px; }

        /* ticker */
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-track { animation: ticker 22s linear infinite; display: inline-flex; gap: 3rem; }
        .ticker-track:hover { animation-play-state: paused; }

        /* live dot */
        @keyframes pricePulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block; animation: pricePulse 2.4s ease-in-out infinite; }

        /* built-for */
        .built-strip {
          background: #f5f2eb; border-bottom: 1px solid #1a2e1b1a;
          padding: 3.5rem 1.5rem; display: flex; flex-direction: column; align-items: column; text-align: center; gap: 1rem;
        }
        .built-title { font-family: 'DM Serif Display', serif; font-size: clamp(2.2rem, 10vw, 3.4rem); line-height: 1.05; color: #0e1a0f; margin: 0 auto; max-width: 10ch; text-align:center;}
        .built-body  { font-size: 1rem; line-height: 1.7; color: #3d5c42; font-weight: 300; margin: 0 auto; max-width: 22ch; text-align: center;}

        /* pillars */
        .pillars-section { background: #0e1a0f; padding: 3.5rem 1.5rem; }
        .pillars-eyebrow { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #4a7c59; margin-bottom: 2.25rem; font-weight: 500; }
        .pillars-grid { display: grid; grid-template-columns: 1fr; border: 1px solid #2d5230; }

        .pillar-card {
          padding: 2rem 1.5rem; position: relative; overflow: hidden;
          transition: background 0.3s; cursor: default;
          border-right: 1px solid #2d5230;
          border-bottom: 1px solid #2d5230;
        }
        .pillar-card:hover { background: #1a2e1b; }
        .pillar-card:nth-child(2n)        { border-right: none; }
        .pillar-card:nth-last-child(-n+2) { border-bottom: none; }

        .pillar-num   { position: absolute; top: 10px; right: 14px; font-family: 'DM Serif Display', serif; font-size: 4.5rem; line-height: 1; color: #2d5230; opacity: 0.6; pointer-events: none; user-select: none; }
        .pillar-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: #e8f5ea; margin: 1rem 0 0.6rem; line-height: 1.2; }
        .pillar-text  { font-size: 0.875rem; line-height: 1.7; color: #6a9470; font-weight: 300; margin: 0; }

        /* cta band */
        .cta-band {
          background: #f5f2eb; border-top: 1px solid #1a2e1b1a;
          padding: 5rem 1.5rem; display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 1.5rem;
        }
        .cta-title { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; color: #0e1a0f; max-width: 18ch; margin: 0; }
        .cta-body  { font-size: clamp(0.95rem, 1.2vw, 1.05rem); line-height: 1.75; color: #3d5c42; font-weight: 300; max-width: 50ch; margin: 0; }

        /* grain */
        .grain { position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E"); background-size: 180px; }

        /* ── TABLET ≥ 640px ── */
        @media (min-width: 640px) {
          .hero-left    { padding: 2.25rem 2rem 2rem; gap: 1.5rem; }
          .hero-h1      { font-size: clamp(2.2rem, 5.5vw, 3rem); }
          .hero-desc    { font-size: 0.95rem; }
          .built-strip  { padding: 4rem 2.5rem; flex-direction: column; align-items: center; text-align:center; gap: 1.25rem; }
          .built-title  { flex: unset; max-width: 8ch; }
          .built-body  {max-width: 28ch;}
          .pillars-section { padding: 4rem 2.5rem; }
          .cta-band     { padding: 6rem 2rem; gap: 1.5rem; }
          .pillars-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── DESKTOP ≥ 1024px ── */
        @media (min-width: 1024px) {
          .hero-body {
            grid-template-columns: 1fr 1fr;
            height: calc(100vh - 64px);
            max-height: 760px;
            min-height: 520px;
          }
          .hero-img-col { display: block; position: relative; overflow: hidden; }
          .hero-left {
            padding: clamp(2rem, 3.5vw, 3.5rem);
            border-right: 1px solid #1a2e1b1a;
            justify-content: space-between;
            gap: 0;
          }
          .hero-h1  { font-size: clamp(2.4rem, 3.5vw, 3.5rem); }
          .hero-desc { font-size: 0.95rem; }

          .pillars-grid { grid-template-columns: repeat(4, 1fr); }
          .pillar-card  { border-bottom: none !important; }
          .pillar-card:nth-child(2n)   { border-right: 1px solid #2d5230 !important; }
          .pillar-card:last-child      { border-right: none !important; }
          .pillar-card  { padding: 2.5rem 2rem; }
          .pillar-num   { font-size: 5rem; }
          .pillar-title { font-size: 1.3rem; margin: 1.25rem 0 0.7rem; }
          .pillar-text  { font-size: 0.9rem; }

          .pillars-section { padding: clamp(4rem, 5vw, 6rem) clamp(2.5rem, 5vw, 5rem); }
          .built-strip     { padding: 5rem 2 rem; width:100%; max-width:100%; }
          .built-title     { max-width: 18ch; font-size: clamp(3.2rem, 5vw, 5rem);}
          .built-body      { max-width: 70ch; font-size: 1.15rem;}
          .cta-band        { padding: 7rem 2rem; gap: 1.75rem; }
        }
      `}</style>

      <div className="hr">

        {/* ══════ HERO ══════ */}
        <section className="hero">
          <div className="grain" />
          <div className="hero-body">

            {/* LEFT */}
            <div className="hero-left">
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <motion.p className="hero-badge" {...fade(0.04)}>{t("homeBadge")}</motion.p>
                <motion.h1 className="hero-h1"   {...fade(0.12)}>{t("homeTitle")}</motion.h1>
                <motion.p className="hero-desc"  {...fade(0.20)}>{t("welcome")} {t("homeDescription")}</motion.p>
              </div>

              <motion.div className="cta-row" {...fade(0.28)}>
                <Link to="/register" className="btn-primary">{t("createFarmerAccount")} <ArrowUpRight size={14} /></Link>
                <Link to="/login"    className="btn-ghost">{t("signInDashboard")}</Link>
              </motion.div>

              <motion.div className="stat-strip" {...fade(0.36)}>
                {[t("quickStatMarkets"), t("quickStatWeather"), t("quickStatDemand")].map((label, i) => (
                  <div key={label}>
                    <p className="stat-val">{statValues[i]}</p>
                    <p className="stat-label">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — image (desktop only via CSS) */}
            <motion.div className="hero-img-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.8 }}>
              <div className="hero-img-inner">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
                  alt="Farmland"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(14,26,15,0.38) 100%)" }} />

                <motion.div className="pulse-card" animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="pulse-header">
                    <span className="pulse-label">{t("homePulseTitle")}</span>
                    <span className="live-dot" />
                  </div>
                  <div className="pulse-grid">
                    <div className="pulse-cell">
                      <p className="pulse-cell-label">{t("homePulseCrop")}</p>
                      <p className="pulse-cell-val">₹2,450</p>
                      <p className="pulse-cell-sub">{t("homePulseCropSub")}</p>
                    </div>
                    <div className="pulse-cell">
                      <p className="pulse-cell-label">{t("homePulseRain")}</p>
                      <p className="pulse-cell-val" style={{ fontSize: "0.95rem" }}>{t("homePulseRainText")}</p>
                      <p className="pulse-cell-sub">{t("homePulseRainSub")}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ══════ TICKER ══════ */}
        <div style={{ background: "#1a2e1b", color: "#8fb897", overflow: "hidden", whiteSpace: "nowrap", padding: "0.6rem 0", borderTop: "1px solid #2d5230", borderBottom: "1px solid #2d5230" }}>
          <div className="ticker-track">
            {[...Array(2)].map((_, r) => (
              <span key={r} style={{ display: "inline-flex", gap: "3rem" }}>
                {["Wheat ↑ ₹2,150","Rice ↓ ₹1,890","Maize ↑ ₹1,680","Soybean ↑ ₹4,250","Cotton ↓ ₹6,100","Sugarcane ↑ ₹320"].map(item => (
                  <span key={item} style={{ fontSize: 11, letterSpacing: "0.06em" }}>
                    {item}<span style={{ margin: "0 1.5rem", opacity: 0.3 }}>·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ══════ BUILT-FOR ══════ */}
        <motion.section className="built-strip" {...fadeView()}>
          <p className="built-title">{t("builtForTitle")}</p>
          <p className="built-body">{t("builtForText")}</p>
        </motion.section>

        {/* ══════ PILLARS ══════ */}
        <section className="pillars-section">
          <p className="pillars-eyebrow">{t("homeBadge")}</p>
          <div className="pillars-grid">
            {pillars.map((item, i) => (
              <motion.article key={item.title} className="pillar-card" {...fadeView(i * 0.08)}>
                <span className="pillar-num">{item.num}</span>
                <item.icon size={22} color="#4ade80" strokeWidth={1.5} />
                <h2 className="pillar-title">{item.title}</h2>
                <p className="pillar-text">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ══════ BOTTOM CTA ══════ */}
        <motion.section className="cta-band" {...fadeView()}>
          <p className="cta-title">{t("homeCard1Title")}</p>
          <p className="cta-body">{t("homeCard1Text")}</p>
          <Link to="/register" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "0.95rem" }}>
            {t("createFarmerAccount")} <ArrowUpRight size={14} />
          </Link>
        </motion.section>

      </div>
    </>
  );
};