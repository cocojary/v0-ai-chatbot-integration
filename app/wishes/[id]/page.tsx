import { notFound } from "next/navigation";
import { mockWishes } from "@/lib/mock-data";
import { WishDetailClient } from "./wish-detail-client";

export default async function WishDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wish = mockWishes.find((w) => w.id === id);

  if (!wish) {
    notFound();
  }

  return <WishDetailClient wishId={id} />;
}
