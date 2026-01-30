import { NegotiateClient } from "./negotiate-client";

export default async function NegotiatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NegotiateClient productId={id} />;
}
