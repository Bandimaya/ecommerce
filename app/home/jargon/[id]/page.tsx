import JargonDetailClient from "../JargonDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // 1. Await the params object (Required for Next.js 15+)
  const resolvedParams = await params;

  // 2. Decode the ID 
  // (Because we used encodeURIComponent in the carousel link)
  const id = decodeURIComponent(resolvedParams.id);

  // 3. Pass the clean ID to the client component
  return <JargonDetailClient id={id} />;
}