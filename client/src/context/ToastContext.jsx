import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const toastStyles = {
  success: {
    icon: CheckCircle2,
    accent: "border-emerald-200 bg-emerald-50 text-emerald-900",
    iconClass: "text-emerald-600"
  },
  error: {
    icon: AlertCircle,
    accent: "border-rose-200 bg-rose-50 text-rose-900",
    iconClass: "text-rose-600"
  },
  info: {
    icon: Info,
    accent: "border-sky-200 bg-sky-50 text-sky-900",
    iconClass: "text-sky-600"
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nextToast = { id, message, type };

    setToasts((current) => [...current, nextToast]);

    const timer = setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      timers.current.delete(id);
    }, 3600);

    timers.current.set(id, timer);
  }, []);

  const value = useMemo(
    () => ({
      showToast: pushToast,
      success: (message) => pushToast(message, "success"),
      error: (message) => pushToast(message, "error"),
      info: (message) => pushToast(message, "info")
    }),
    [pushToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = toastStyles[toast.type] || toastStyles.info;
            const Icon = styles.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto overflow-hidden rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${styles.accent}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${styles.iconClass}`} />
                  <p className="flex-1 text-sm leading-6">{toast.message}</p>
                  <button type="button" onClick={() => dismissToast(toast.id)} className="rounded-full p-1 text-slate-500 transition hover:bg-white/60 hover:text-slate-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
