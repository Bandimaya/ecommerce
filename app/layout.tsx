import "./globals.css";
import MainLayout from "./MainLayout";

export const metadata = {
  title: "My E-commerce Store | Buy Online",
  description: "The best products for STEM enthusiasts.",
  keywords: "STEM, 3D Printing, Shop",
  openGraph: {
    title: "My E-commerce Store",
    description: "The best products for STEM enthusiasts.",
    url: "https://www.example.com/",
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
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
