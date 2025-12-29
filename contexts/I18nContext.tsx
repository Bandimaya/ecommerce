"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useLanguage } from "./LanguageContext";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import qa from "../locales/qa.json";

type Messages = Record<string, any>;

interface I18nContextType {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useLanguage();

  const messages: Messages = useMemo(() => {
    if (lang === "ar") return ar;
    if (lang === "qa") return qa;
    return en;
  }, [lang]);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const parts = key.split(".");
    let cur: any = messages;
    for (const p of parts) {
      if (cur && p in cur) cur = cur[p];
      else {
        // fallback to key
        return interpolate(key, vars);
      }
    }
    if (typeof cur === "string") return interpolate(cur, vars);
    return interpolate(String(cur), vars);
  };

  return <I18nContext.Provider value={{ t, locale: lang }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

function interpolate(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str;
  return str.replace(/\{(.*?)\}/g, (_, k) => String(vars[k.trim()] ?? ""));
}
