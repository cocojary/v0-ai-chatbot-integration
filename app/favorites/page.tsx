"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { products } from "@/lib/mock-data";
import { Heart } from "lucide-react";
import { AIChatbox } from "@/components/ai-chatbox"; // Import AIChatbox component

export default function FavoritesPage() {
  const router = useRouter();
  const { currentUser, favorites } = useAppStore();

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">お気に入り</h1>
            <p className="text-muted-foreground">
              {favoriteProducts.length}件の商品
            </p>
          </div>

          {favoriteProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <p className="mb-2 text-lg font-medium text-foreground">
                お気に入りはまだありません
              </p>
              <p className="mb-6 text-muted-foreground">
                気になる商品をお気に入りに追加しましょう
              </p>
              <Button asChild>
                <Link href="/products">商品を探す</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AISpecFinder /> {/* Declare AIChatbox component */}
    </div>
  );
}
