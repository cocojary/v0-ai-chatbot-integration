"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  ChevronRight,
  Search,
  Filter,
  Heart,
  MapPin,
  Eye,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

const tierLabels = {
  best: { label: "最適", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-200" },
  close: { label: "条件に近い", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  alternative: { label: "代替候補", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
};

const conditionLabels: Record<string, string> = {
  new: "新品",
  used: "中古",
  refurbished: "整備済",
};

export default function SearchResultsPage() {
  const router = useRouter();
  const { lastSearchQuery, lastSearchResults, favorites, toggleFavorite } = useAppStore();

  if (!lastSearchResults || lastSearchResults.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <Card className="text-center">
              <CardContent className="py-12">
                <Search className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h2 className="mt-4 text-xl font-semibold text-foreground">検索結果がありません</h2>
                <p className="mt-2 text-muted-foreground">
                  AI Spec Finderで検索を行ってから、この詳細ページをご確認ください。
                </p>
                <Button className="mt-6" onClick={() => router.push("/")}>
                  ホームに戻る
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const bestMatches = lastSearchResults.filter((m) => m.matchTier === "best");
  const closeMatches = lastSearchResults.filter((m) => m.matchTier === "close");
  const alternativeMatches = lastSearchResults.filter((m) => m.matchTier === "alternative");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">検索結果詳細</span>
          </div>

          {/* Back Button & Title */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
            <h1 className="text-2xl font-bold text-foreground">検索結果詳細</h1>
            <p className="mt-2 text-muted-foreground">
              検索条件: 「{lastSearchQuery}」
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">総件数</p>
                <p className="text-2xl font-bold text-foreground">{lastSearchResults.length}</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <p className="text-sm text-green-700">最適</p>
                <p className="text-2xl font-bold text-green-700">{bestMatches.length}</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <p className="text-sm text-orange-700">条件に近い</p>
                <p className="text-2xl font-bold text-orange-700">{closeMatches.length}</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <p className="text-sm text-blue-700">代替候補</p>
                <p className="text-2xl font-bold text-blue-700">{alternativeMatches.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Results by Tier */}
          {(["best", "close", "alternative"] as const).map((tier) => {
            const matches = lastSearchResults.filter((m) => m.matchTier === tier);
            if (matches.length === 0) return null;

            const tierConfig = tierLabels[tier];

            return (
              <div key={tier} className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${tierConfig.color}`} />
                  <h2 className="text-lg font-semibold text-foreground">
                    {tierConfig.label} ({matches.length}件)
                  </h2>
                </div>

                <div className="space-y-4">
                  {matches.map((match) => {
                    const isFavorite = favorites.includes(match.product.id);

                    return (
                      <Card
                        key={match.product.id}
                        className={`overflow-hidden transition-shadow hover:shadow-lg ${tierConfig.borderColor}`}
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Product Image */}
                          <Link
                            href={`/products/${match.product.id}`}
                            className="relative h-48 w-full shrink-0 bg-secondary md:h-auto md:w-56"
                          >
                            {match.product.images?.[0] ? (
                              <Image
                                src={match.product.images[0] || "/placeholder.svg"}
                                alt={match.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-16 w-16 text-muted-foreground/50" />
                              </div>
                            )}
                            <div className="absolute left-2 top-2">
                              <Badge variant="secondary">
                                {conditionLabels[match.product.condition] || "中古"}
                              </Badge>
                            </div>
                          </Link>

                          {/* Product Info */}
                          <div className="flex flex-1 flex-col p-4">
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex-1">
                                <Link href={`/products/${match.product.id}`}>
                                  <h3 className="text-lg font-semibold text-foreground hover:text-primary">
                                    {match.product.name}
                                  </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                  {match.product.manufacturer} | {match.product.model}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(match.product.id)}
                              >
                                <Heart
                                  className={`h-5 w-5 ${
                                    isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
                                  }`}
                                />
                              </Button>
                            </div>

                            {/* Price & Location */}
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(match.product.price)}
                                </span>
                                {match.product.originalPrice && match.product.originalPrice > match.product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(match.product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {match.product.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {match.product.views}
                                </span>
                              </div>
                            </div>

                            <Separator className="my-3" />

                            {/* Match Score & Details */}
                            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                              {/* Match Score */}
                              <div className="shrink-0 md:w-40">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="text-sm font-medium text-foreground">適合度</span>
                                  <span className={`text-lg font-bold ${tierConfig.textColor}`}>
                                    {match.matchScore}%
                                  </span>
                                </div>
                                <Progress
                                  value={match.matchScore}
                                  className="h-2"
                                />
                              </div>

                              {/* Match Reasons */}
                              <div className="flex-1 space-y-2">
                                <p className="mb-2 text-sm font-medium text-foreground">適合理由:</p>
                                
                                {match.specMatch.matched.length > 0 && (
                                  <div className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                    <div>
                                      <p className="text-xs font-medium text-green-700">条件に適合</p>
                                      <p className="text-sm text-muted-foreground">
                                        {match.specMatch.matched.join("、")}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {match.specMatch.partial.length > 0 && (
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                    <div>
                                      <p className="text-xs font-medium text-orange-700">一部適合</p>
                                      <p className="text-sm text-muted-foreground">
                                        {match.specMatch.partial.join("、")}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {match.specMatch.missing.length > 0 && (
                                  <div className="flex items-start gap-2">
                                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                                    <div>
                                      <p className="text-xs font-medium text-blue-700">情報未記載</p>
                                      <p className="text-sm text-muted-foreground">
                                        {match.specMatch.missing.join("、")}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {match.specMatch.notMatched.length > 0 && (
                                  <div className="flex items-start gap-2">
                                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                    <div>
                                      <p className="text-xs font-medium text-red-700">条件外</p>
                                      <p className="text-sm text-muted-foreground">
                                        {match.specMatch.notMatched.join("、")}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action */}
                              <div className="shrink-0">
                                <Button asChild>
                                  <Link href={`/products/${match.product.id}`}>
                                    詳細を見る
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
