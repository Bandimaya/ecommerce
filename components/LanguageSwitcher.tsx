"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "ar";

/* 🔥 SET GOOGLE TRANSLATE COOKIE */
function setGoogleLang(lang: Lang) {
    const value = `/en/${lang}`;
    const domain = window.location.hostname;

    document.cookie = `googtrans=${value};path=/;domain=${domain}`;
    document.cookie = `googtrans=${value};path=/`;
    localStorage.setItem("lang", lang);

    // RTL support
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // Reload to force apply (required)
    window.location.reload();
}

export default function LanguageToggle() {
    const [lang, setLang] = useState<Lang>("en");

    useEffect(() => {
        const saved = localStorage.getItem("lang") as Lang | null;
        if (saved) {
            setLang(saved);
            document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
        }
    }, []);

    const toggleLanguage = () => {
        const next = lang === "en" ? "ar" : "en";
        setLang(next);
        setGoogleLang(next);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-full border text-sm font-semibold
                 hover:bg-gray-100 transition"
        >
            {lang === "en" ? "AR" : "EN"}
        </button>
    );
}
