// app/layout.tsx
import React from 'react';
import type { Metadata, Viewport } from "next";
import GTranslate from "@/components/GTranslate";
import MainLayout from "./MainLayout";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "My E-commerce Store | Buy Online",
  description: "The best products for STEM enthusiasts.",
  keywords: ["STEM", "3D Printing", "Shop", "Robotics", "Learning"],
  
  // These control the icon shown in the browser tab
  icons: {
    icon: [
      { url: "/assets/favicon.png" },
      { url: "/assets/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/assets/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    title: "My E-commerce Store",
    description: "The best products for STEM enthusiasts.",
    url: "https://stempark.logybyte.in/",
    siteName: "STEM Park",
    type: "website",
    images: [
      {
        url: "/assets/logo.png", // Ensure you have a high-res OG image here
        width: 1200,
        height: 630,
        alt: "STEM Park Store",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Ensures proper rendering on mobile devices */}
      </head>
      <body>
        <GTranslate />
        
        {/* The visible Logo is likely inside this MainLayout component */}
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}