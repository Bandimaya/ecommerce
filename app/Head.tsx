import Head from "next/head";
import LocalizedHead from "@/components/LocalizedHead";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>My E-commerce Store | Buy Online</title>
        <meta name="description" content="The best products for STEM enthusiasts." />
        <meta name="keywords" content="STEM, 3D Printing, Shop" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.example.com/" />
      </Head>

      {/* Localized client-side head & visible H1 for accessibility */}
      <LocalizedHead />
    </>
  );
}
