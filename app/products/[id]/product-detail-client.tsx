"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import {
  Heart,
  MapPin,
  Eye,
  Calendar,
  Building2,
  Package,
  MessageSquare,
  ChevronRight,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { AIChatbox } from "@/components/ai-chatbox";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

const conditionLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "新品", variant: "default" },
  used: { label: "中古", variant: "secondary" },
  refurbished: { label: "整備済", variant: "outline" },
};

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { favorites, toggleFavorite, currentUser } = useAppStore();
  const isFavorite = favorites.includes(product.id);
  const condition = conditionLabels[product.condition] || conditionLabels.used;
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-foreground">
              商品一覧
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
                {images.length > 0 ? (
                  <Image
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-32 w-32 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute left-4 top-4 flex gap-2">
                  <Badge variant={condition.variant}>{condition.label}</Badge>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2">
                {images.length > 0 ? (
                  images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-20 w-20 overflow-hidden rounded-md border ${
                        selectedImage === i ? "border-primary ring-2 ring-primary" : "border-border"
                      }`}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))
                ) : (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-20 w-20 items-center justify-center rounded-md border border-border bg-secondary"
                    >
                      <Package className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  {product.manufacturer}
                </p>
                <h1 className="mb-4 text-2xl font-bold text-foreground lg:text-3xl text-balance">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{product.views}回閲覧</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{product.createdAt}出品</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">税込価格</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {currentUser ? (
                  <Button size="lg" className="flex-1" asChild>
                    <Link href={`/negotiate/${product.id}`}>
                      <MessageSquare className="mr-2 h-5 w-5" />
                      交渉を始める
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="flex-1" asChild>
                    <Link href="/login">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      ログインして交渉
                    </Link>
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`mr-2 h-5 w-5 ${
                      isFavorite ? "fill-destructive text-destructive" : ""
                    }`}
                  />
                  {isFavorite ? "お気に入り済み" : "お気に入り"}
                </Button>
                <Button size="lg" variant="ghost">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Seller Info */}
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {product.sellerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      出品者
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-accent">
                    <ShieldCheck className="h-4 w-4" />
                    <span>認証済み</span>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Notice */}
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">安心取引サポート</p>
                    <p className="text-muted-foreground">
                      エスクロー決済により、商品確認後に代金が出品者に支払われます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">商品説明</TabsTrigger>
              <TabsTrigger value="specs">仕様</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap text-foreground">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 pr-4 text-sm font-medium text-muted-foreground">
                          メーカー
                        </td>
                        <td className="py-3 text-sm text-foreground">
                          {product.manufacturer}
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 pr-4 text-sm font-medium text-muted-foreground">
                          型番
                        </td>
                        <td className="py-3 text-sm text-foreground">
                          {product.model}
                        </td>
                      </tr>
                      {product.year && (
                        <tr className="border-b border-border">
                          <td className="py-3 pr-4 text-sm font-medium text-muted-foreground">
                            製造年
                          </td>
                          <td className="py-3 text-sm text-foreground">
                            {product.year}年
                          </td>
                        </tr>
                      )}
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b border-border last:border-0">
                          <td className="py-3 pr-4 text-sm font-medium text-muted-foreground">
                            {key}
                          </td>
                          <td className="py-3 text-sm text-foreground">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                関連商品
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <Card key={p.id} className="overflow-hidden">
                    <Link href={`/products/${p.id}`}>
                      <div className="relative aspect-[4/3] bg-secondary">
                        {p.images && p.images.length > 0 ? (
                          <Image
                            src={p.images[0] || "/placeholder.svg"}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="mb-1 line-clamp-1 text-sm font-medium text-foreground">
                          {p.name}
                        </h3>
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(p.price)}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <AISpecFinder />
    </div>
  );
}
