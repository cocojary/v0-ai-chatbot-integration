"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { CategoryCard } from "@/components/category-card";
import { categories } from "@/lib/mock-data";
import { AIChatbox } from "@/components/ai-chatbox"; // Added import for AIChatbox

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">カテゴリー</h1>
            <p className="text-muted-foreground">
              カテゴリーから商品を探す
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <AISpecFinder /> {/* Added AIChatbox component */}
    </div>
  );
}
