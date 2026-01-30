"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import {
  Users,
  Package,
  ChevronRight,
  MessageSquare,
  Check,
  Target,
  TrendingUp,
  Mail,
  Eye,
  Calendar,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PotentialBuyersPage() {
  const { products, productWishMatches, markProductWishContacted, currentUser } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [contactMessage, setContactMessage] = useState("");
  const [contactingMatchId, setContactingMatchId] = useState<string | null>(null);

  // Get seller's products (demo: use seller-001 for demo, or use current user if seller)
  // For demo purposes, show products from seller-001 which has the most potential buyer matches
  const sellerId = "seller-001";
  const myProducts = products.filter((p) => p.sellerId === sellerId);

  // Get all potential buyer matches for my products
  const myProductIds = myProducts.map((p) => p.id);
  const allMatches = productWishMatches.filter((m) => myProductIds.includes(m.productId));

  // Filter by selected product
  const filteredMatches =
    selectedProduct === "all"
      ? allMatches
      : allMatches.filter((m) => m.productId === selectedProduct);

  // Group matches by product
  const matchesByProduct = myProducts.map((product) => ({
    product,
    matches: allMatches.filter((m) => m.productId === product.id),
  })).filter((g) => g.matches.length > 0);

  // Stats
  const totalPotentialBuyers = allMatches.length;
  const contactedCount = allMatches.filter((m) => m.contacted).length;
  const avgMatchScore = allMatches.length > 0
    ? Math.round(allMatches.reduce((sum, m) => sum + m.matchScore, 0) / allMatches.length)
    : 0;

  const handleContact = (matchId: string) => {
    markProductWishContacted(matchId);
    setContactingMatchId(null);
    setContactMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/dashboard" className="hover:text-foreground">
              ダッシュボード
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">潜在的な購入希望者</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">潜在的な購入希望者</h1>
            <p className="mt-1 text-muted-foreground">
              あなたの出品商品に興味を持ちそうな購入希望者の一覧です
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">潜在的な購入希望者</p>
                  <p className="text-2xl font-bold text-foreground">{totalPotentialBuyers}人</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-accent/10 p-3">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">コンタクト済み</p>
                  <p className="text-2xl font-bold text-foreground">{contactedCount}人</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-orange-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">平均マッチ度</p>
                  <p className="text-2xl font-bold text-foreground">{avgMatchScore}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="by-product" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="by-product">商品別</TabsTrigger>
                <TabsTrigger value="all-matches">全てのマッチ</TabsTrigger>
              </TabsList>
              
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="商品を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全ての商品</SelectItem>
                  {myProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* By Product Tab */}
            <TabsContent value="by-product" className="space-y-6">
              {matchesByProduct.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      まだ潜在的な購入希望者はいません
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      商品を出品すると、希望条件にマッチするユーザーが表示されます
                    </p>
                  </CardContent>
                </Card>
              ) : (
                matchesByProduct.map(({ product, matches }) => (
                  <Card key={product.id}>
                    <CardHeader className="border-b border-border">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link href={`/products/${product.id}`}>
                            <CardTitle className="text-base hover:text-primary">
                              {product.name}
                            </CardTitle>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {product.manufacturer} | {formatPrice(product.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary">
                              <Users className="mr-1 h-3 w-3" />
                              {matches.length}人の購入希望者
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="divide-y divide-border">
                      {matches.map((match) => (
                        <div key={match.id} className="flex items-center justify-between py-4 first:pt-4 last:pb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">
                                {match.wishUserName}
                              </p>
                              {match.contacted && (
                                <Badge variant="outline" className="text-xs">
                                  <Check className="mr-1 h-3 w-3" />
                                  コンタクト済み
                                </Badge>
                              )}
                            </div>
                            <Link href={`/wishes/${match.wishId}`}>
                              <p className="text-sm text-primary hover:underline">
                                {match.wishTitle}
                              </p>
                            </Link>
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                <span>マッチ度 {match.matchScore}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(match.createdAt)}</span>
                              </div>
                            </div>
                            {/* Match details */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {match.matchDetails.categoryMatch && (
                                <Badge variant="secondary" className="text-xs">カテゴリー一致</Badge>
                              )}
                              {match.matchDetails.keywordMatches.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  キーワード: {match.matchDetails.keywordMatches.join(", ")}
                                </Badge>
                              )}
                              {match.matchDetails.brandMatch && (
                                <Badge variant="secondary" className="text-xs">ブランド一致</Badge>
                              )}
                              {match.matchDetails.priceInRange && (
                                <Badge variant="secondary" className="text-xs">価格帯適合</Badge>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <Progress value={match.matchScore} className="w-20" />
                            {!match.contacted ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" onClick={() => setContactingMatchId(match.id)}>
                                    <Mail className="mr-1 h-4 w-4" />
                                    コンタクト
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>購入希望者にコンタクト</DialogTitle>
                                    <DialogDescription>
                                      {match.wishUserName}さんに商品をアピールするメッセージを送信します
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="mb-2 text-sm font-medium">希望条件:</p>
                                      <p className="text-sm text-muted-foreground">{match.wishTitle}</p>
                                    </div>
                                    <div>
                                      <p className="mb-2 text-sm font-medium">メッセージ:</p>
                                      <Textarea
                                        placeholder="商品の魅力やおすすめポイントを伝えましょう..."
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                        rows={4}
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => setContactingMatchId(null)}
                                      >
                                        キャンセル
                                      </Button>
                                      <Button onClick={() => handleContact(match.id)}>
                                        送信する
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/negotiations?wishId=${match.wishId}`}>
                                  <Eye className="mr-1 h-4 w-4" />
                                  詳細
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* All Matches Tab */}
            <TabsContent value="all-matches" className="space-y-4">
              {filteredMatches.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      マッチする購入希望者が見つかりませんでした
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredMatches.map((match) => {
                  const product = myProducts.find((p) => p.id === match.productId);
                  if (!product) return null;

                  return (
                    <Card key={match.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {match.wishUserName}
                            </p>
                            {match.contacted && (
                              <Badge variant="outline" className="text-xs">
                                <Check className="mr-1 h-3 w-3" />
                                コンタクト済み
                              </Badge>
                            )}
                          </div>
                          <Link href={`/wishes/${match.wishId}`}>
                            <p className="text-sm text-primary hover:underline">
                              {match.wishTitle}
                            </p>
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            商品: {product.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-primary">{match.matchScore}%</p>
                            <p className="text-xs text-muted-foreground">マッチ度</p>
                          </div>
                          {!match.contacted ? (
                            <Button size="sm" onClick={() => handleContact(match.id)}>
                              <Mail className="mr-1 h-4 w-4" />
                              コンタクト
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Check className="mr-1 h-4 w-4" />
                              済み
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <AISpecFinder />
    </div>
  );
}
