"use client"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import CircuitBackground from "@/components/background/CircuitBackground";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname()

    return <div className="min-h-screen flex flex-col">
        <CircuitBackground />
        {!pathname.includes('/login') && <Navbar />}
        <main className="flex-1">{children}</main>
        {!pathname.includes('/login') && <Footer />}
        {!pathname.includes('/login') && <ChatBot />}
    </div>
}