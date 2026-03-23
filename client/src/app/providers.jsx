import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ToastProvider } from "../context/ToastContext";

export const AppProviders = ({ children }) => (
  <LanguageProvider>
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  </LanguageProvider>
);
