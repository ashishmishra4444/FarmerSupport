import { createContext, useContext, useState } from "react";
import i18n from "../app/i18n";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem("language") || "en");

  const setLanguage = (value) => {
    setLanguageState(value);
    localStorage.setItem("language", value);
    i18n.changeLanguage(value);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
