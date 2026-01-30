import { notFound } from "next/navigation";
import { categories } from "@/lib/mock-data";
import { CategoryDetailClient } from "./category-detail-client";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);

  if (!category) {
    notFound();
  }

  return <CategoryDetailClient category={category} />;
}
