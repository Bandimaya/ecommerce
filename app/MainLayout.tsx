"use client"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Providers from "./providers";

export default function MainLayout({ children }: any) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <Providers>
            {isAdmin ? <>{children}</> : <RenderLayout>{children}</RenderLayout>}
        </Providers>
    );
}

function RenderLayout({ children }: any) {
    const { lang } = useLanguage()
    const isArabic = useMemo(() => lang === 'ar' || lang === 'qa', [lang]);

    return <div dir={isArabic ? "rtl" : "ltr"}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatBot />
    </div>
}