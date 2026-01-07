// app/layout.tsx
import GTranslate from "@/components/GTranslate"; // Import the new component
import "./globals.css";
import MainLayout from "./MainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My E-commerce Store | Buy Online",
  description: "The best products for STEM enthusiasts.",
  keywords: ["STEM", "3D Printing", "Shop"],

  icons: {
    icon: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },

  openGraph: {
    title: "My E-commerce Store",
    description: "The best products for STEM enthusiasts.",
    url: "https://stempark.logybyte.in/", // Ensure this is your live URL
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GTranslate />
        
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}