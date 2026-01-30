import { notFound } from "next/navigation";
import { NegotiationDetailClient } from "./negotiation-detail-client";

export default async function NegotiationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <NegotiationDetailClient id={id} />;
}
