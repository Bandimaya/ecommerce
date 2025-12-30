"use client";

import React, { createContext, useContext, useMemo } from "react";
import en from "../locales/en.json";

type Messages = Record<string, any>;

interface I18nContextType {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  // Always use English messages (translations removed)
  const messages: Messages = useMemo(() => en as Messages, []);

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

  return <I18nContext.Provider value={{ t, locale: 'en' }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // If used outside provider, provide a minimal t implementation
    return {
      t: (k: string, vars?: Record<string, string | number>) => {
        const parts = k.split(".");
        let cur: any = en as Messages;
        for (const p of parts) {
          if (cur && p in cur) cur = cur[p];
          else return interpolate(k, vars);
        }
        if (typeof cur === "string") return interpolate(cur, vars);
        return interpolate(String(cur), vars);
      },
      locale: 'en'
    };
  }
  return ctx;
};

function interpolate(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str;
  return str.replace(/\{(.*?)\}/g, (_, k) => String(vars[k.trim()] ?? ""));
}
