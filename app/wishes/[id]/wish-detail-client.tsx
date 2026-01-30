"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Edit,
  ExternalLink,
  Mail,
  Pause,
  Play,
  Target,
  Trash2,
  Check,
  AlertTriangle,
  Package,
} from "lucide-react";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "有効", variant: "default" },
  paused: { label: "一時停止", variant: "secondary" },
  fulfilled: { label: "達成", variant: "outline" },
  expired: { label: "期限切れ", variant: "destructive" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

export function WishDetailClient({ wishId }: { wishId: string }) {
  const router = useRouter();
  const { wishes, wishMatches, products, updateWish, deleteWish } = useAppStore();

  const wish = wishes.find((w) => w.id === wishId);
  const matches = wishMatches.filter((m) => m.wishId === wishId);

  if (!wish) {
    return null;
  }

  const matchedProducts = matches.map((match) => ({
    match,
    product: products.find((p) => p.id === match.productId),
  })).filter((item) => item.product);

  const status = statusLabels[wish.status];

  const handleToggleStatus = () => {
    const newStatus = wish.status === "active" ? "paused" : "active";
    updateWish(wish.id, { status: newStatus as "active" | "paused" });
  };

  const handleDelete = () => {
    deleteWish(wish.id);
    router.push("/wishes");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Back Button */}
          <Link
            href="/wishes"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            希望リストに戻る
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {wish.emailNotification && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="mr-1 h-3 w-3" />
                            メール通知
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{wish.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleStatus}
                      >
                        {wish.status === "active" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            一時停止
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            有効化
                          </>
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            削除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>希望を削除しますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は取り消せません。関連するマッチング情報も削除されます。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {wish.description && (
                    <p className="mb-6 text-muted-foreground">{wish.description}</p>
                  )}

                  <Tabs defaultValue="matches">
                    <TabsList className="mb-4">
                      <TabsTrigger value="matches">
                        マッチした商品 ({matchedProducts.length})
                      </TabsTrigger>
                      <TabsTrigger value="criteria">検索条件</TabsTrigger>
                    </TabsList>

                    <TabsContent value="matches">
                      {matchedProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">
                            まだマッチした商品がありません
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            条件に合う商品が出品されると通知されます
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {matchedProducts.map(({ match, product }) => (
                            <Card key={match.id} className="overflow-hidden">
                              <div className="flex">
                                <div className="relative h-32 w-32 shrink-0 bg-secondary">
                                  {product?.images?.[0] ? (
                                    <Image
                                      src={product.images[0] || "/placeholder.svg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <Package className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                  )}
                                </div>
                                <CardContent className="flex flex-1 flex-col justify-between p-4">
                                  <div>
                                    <div className="mb-2 flex items-center gap-2">
                                      <Badge
                                        variant={match.matchScore >= 80 ? "default" : match.matchScore >= 60 ? "secondary" : "outline"}
                                      >
                                        マッチ度 {match.matchScore}%
                                      </Badge>
                                      {!match.notified && (
                                        <Badge variant="destructive">新着</Badge>
                                      )}
                                    </div>
                                    <Link href={`/products/${product?.id}`}>
                                      <h4 className="font-medium text-foreground transition-colors hover:text-primary">
                                        {product?.name}
                                      </h4>
                                    </Link>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {product?.manufacturer} | {formatPrice(product?.price || 0)}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {match.matchDetails.categoryMatch && (
                                      <span className="flex items-center gap-1 text-xs text-green-600">
                                        <Check className="h-3 w-3" /> カテゴリー
                                      </span>
                                    )}
                                    {match.matchDetails.brandMatch && (
                                      <span className="flex items-center gap-1 text-xs text-green-600">
                                        <Check className="h-3 w-3" /> ブランド
                                      </span>
                                    )}
                                    {match.matchDetails.priceInRange && (
                                      <span className="flex items-center gap-1 text-xs text-green-600">
                                        <Check className="h-3 w-3" /> 価格
                                      </span>
                                    )}
                                    {match.matchDetails.keywordMatches.length > 0 && (
                                      <span className="flex items-center gap-1 text-xs text-green-600">
                                        <Check className="h-3 w-3" /> キーワード: {match.matchDetails.keywordMatches.join(", ")}
                                      </span>
                                    )}
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="criteria">
                      <div className="space-y-4">
                        {wish.criteria.category && (
                          <div>
                            <p className="text-sm font-medium text-foreground">カテゴリー</p>
                            <p className="text-sm text-muted-foreground">
                              {wish.criteria.category}
                              {wish.criteria.subcategory && ` > ${wish.criteria.subcategory}`}
                            </p>
                          </div>
                        )}
                        {wish.criteria.keywords && wish.criteria.keywords.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-foreground">キーワード</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {wish.criteria.keywords.map((kw) => (
                                <Badge key={kw} variant="secondary">{kw}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {wish.criteria.brand && (
                          <div>
                            <p className="text-sm font-medium text-foreground">メーカー</p>
                            <p className="text-sm text-muted-foreground">{wish.criteria.brand}</p>
                          </div>
                        )}
                        {wish.criteria.model && (
                          <div>
                            <p className="text-sm font-medium text-foreground">型番</p>
                            <p className="text-sm text-muted-foreground">{wish.criteria.model}</p>
                          </div>
                        )}
                        {(wish.criteria.priceMin || wish.criteria.priceMax) && (
                          <div>
                            <p className="text-sm font-medium text-foreground">価格帯</p>
                            <p className="text-sm text-muted-foreground">
                              {wish.criteria.priceMin ? formatPrice(wish.criteria.priceMin) : "指定なし"}
                              {" ~ "}
                              {wish.criteria.priceMax ? formatPrice(wish.criteria.priceMax) : "指定なし"}
                            </p>
                          </div>
                        )}
                        {(wish.criteria.yearMin || wish.criteria.yearMax) && (
                          <div>
                            <p className="text-sm font-medium text-foreground">製造年</p>
                            <p className="text-sm text-muted-foreground">
                              {wish.criteria.yearMin || "指定なし"}
                              {" ~ "}
                              {wish.criteria.yearMax || "指定なし"}
                            </p>
                          </div>
                        )}
                        {wish.criteria.condition && wish.criteria.condition.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-foreground">商品状態</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {wish.criteria.condition.map((c) => (
                                <Badge key={c} variant="outline">
                                  {c === "new" ? "新品" : c === "used" ? "中古" : "整備済"}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">詳細情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">マッチ閾値</p>
                      <p className="text-sm text-muted-foreground">{wish.matchThreshold}%</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">マッチ数</p>
                      <p className="text-sm text-muted-foreground">{wish.matchCount}件</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">作成日</p>
                      <p className="text-sm text-muted-foreground">{formatDate(wish.createdAt)}</p>
                    </div>
                  </div>
                  {wish.expiresAt && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">有効期限</p>
                          <p className="text-sm text-muted-foreground">{formatDate(wish.expiresAt)}</p>
                        </div>
                      </div>
                    </>
                  )}
                  {wish.lastMatchAt && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">最終マッチ</p>
                          <p className="text-sm text-muted-foreground">{formatDate(wish.lastMatchAt)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">通知設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">アプリ内通知</span>
                    </div>
                    <Badge variant="default">有効</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">メール通知</span>
                    </div>
                    <Badge variant={wish.emailNotification ? "default" : "secondary"}>
                      {wish.emailNotification ? "有効" : "無効"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AISpecFinder />
    </div>
  );
}
