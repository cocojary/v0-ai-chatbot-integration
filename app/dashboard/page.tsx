"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { AIChatbox } from "@/components/ai-chatbox"; // Import AIChatbox component
import {
  Package,
  MessageSquare,
  Heart,
  ShoppingBag,
  TrendingUp,
  Eye,
  ArrowRight,
  Plus,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, products, negotiations, favorites, transactions } = useAppStore();

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const userProducts = products.filter((p) => p.sellerId === currentUser.id);
  const userNegotiations = negotiations.filter(
    (n) => n.buyerId === currentUser.id || n.sellerId === currentUser.id
  );
  const activeNegotiations = userNegotiations.filter(
    (n) => n.status === "pending" || n.status === "countered"
  );
  const userTransactions = transactions.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
  );

  const totalViews = userProducts.reduce((sum, p) => sum + p.views, 0);
  const totalSales = userTransactions
    .filter((t) => t.sellerId === currentUser.id && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: "出品商品",
      value: userProducts.length.toString(),
      icon: Package,
      href: "/my-products",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "進行中の交渉",
      value: activeNegotiations.length.toString(),
      icon: MessageSquare,
      href: "/negotiations",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "お気に入り",
      value: favorites.length.toString(),
      icon: Heart,
      href: "/favorites",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "取引履歴",
      value: userTransactions.length.toString(),
      icon: ShoppingBag,
      href: "/transactions",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Welcome */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                ようこそ、{currentUser.name}さん
              </h1>
              <p className="text-muted-foreground">
                {currentUser.company && `${currentUser.company} | `}
                {currentUser.role === "seller" ? "出品者" : "購入者"}アカウント
              </p>
            </div>
            <Button asChild>
              <Link href="/sell">
                <Plus className="mr-2 h-4 w-4" />
                新規出品
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance */}
            {currentUser.role === "seller" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    パフォーマンス
                  </CardTitle>
                  <CardDescription>出品商品の実績</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        総閲覧数
                      </div>
                      <p className="mt-1 text-2xl font-bold text-foreground">
                        {totalViews.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShoppingBag className="h-4 w-4" />
                        総売上
                      </div>
                      <p className="mt-1 text-2xl font-bold text-foreground">
                        {formatPrice(totalSales)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Negotiations */}
            <Card className={currentUser.role !== "seller" ? "lg:col-span-2" : ""}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>最近の交渉</CardTitle>
                  <CardDescription>直近の交渉状況</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/negotiations">
                    すべて見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {userNegotiations.length > 0 ? (
                  <div className="space-y-3">
                    {userNegotiations.slice(0, 3).map((negotiation) => (
                      <Link
                        key={negotiation.id}
                        href={`/negotiations/${negotiation.id}`}
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Package className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {negotiation.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(negotiation.currentOffer)}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {negotiation.status === "pending" && "交渉中"}
                          {negotiation.status === "accepted" && "承認済み"}
                          {negotiation.status === "rejected" && "却下"}
                          {negotiation.status === "countered" && "カウンター"}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      交渉履歴はまだありません
                    </p>
                    <Button variant="outline" size="sm" className="mt-4 bg-transparent" asChild>
                      <Link href="/products">商品を探す</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>クイックアクション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                    <Link href="/products">
                      <Package className="h-6 w-6" />
                      <span>商品を探す</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                    <Link href="/sell">
                      <Plus className="h-6 w-6" />
                      <span>出品する</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                    <Link href="/favorites">
                      <Heart className="h-6 w-6" />
                      <span>お気に入り</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                    <Link href="/settings">
                      <TrendingUp className="h-6 w-6" />
                      <span>設定</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <AISpecFinder />
    </div>
  );
}
