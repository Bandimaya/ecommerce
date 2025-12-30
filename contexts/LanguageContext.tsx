"use client";

import React, { createContext, useContext } from 'react';

export type LangCode = 'en';

export interface LanguageContextType {
  lang: LangCode;
  direction: 'ltr' | 'rtl';
  toggleLang: (target?: LangCode) => void;
  setLanguage: (lang: LangCode) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Minimal language provider: always English, no side-effects
  const value: LanguageContextType = {
    lang: 'en',
    direction: 'ltr',
    toggleLang: () => {},
    setLanguage: () => {},
    isRTL: false,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) return { lang: 'en' as LangCode, direction: 'ltr' as const, toggleLang: () => {}, setLanguage: () => {}, isRTL: false };
  return context;
};



