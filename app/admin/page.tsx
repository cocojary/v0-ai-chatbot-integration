"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { products, mockUsers, mockNegotiations, mockTransactions } from "@/lib/mock-data";
import {
  Package,
  Users,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminDashboardPage() {
  const { negotiations, transactions } = useAppStore();

  const allNegotiations = [...mockNegotiations, ...negotiations];
  const allTransactions = [...mockTransactions, ...transactions];

  const totalProducts = products.length;
  const totalUsers = mockUsers.length;
  const totalNegotiations = allNegotiations.length;
  const totalTransactions = allTransactions.length;

  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const totalRevenue = allTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const activeNegotiations = allNegotiations.filter(
    (n) => n.status === "pending" || n.status === "countered"
  ).length;

  const stats = [
    {
      title: "総商品数",
      value: totalProducts.toString(),
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "登録ユーザー",
      value: totalUsers.toString(),
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "進行中の交渉",
      value: activeNegotiations.toString(),
      change: "+5%",
      trend: "up",
      icon: MessageSquare,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "完了取引",
      value: totalTransactions.toString(),
      change: "-2%",
      trend: "down",
      icon: ShoppingBag,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  const recentProducts = products.slice(0, 5);
  const recentNegotiations = allNegotiations.slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
        <p className="text-muted-foreground">
          システム全体の概要を確認できます
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-accent" : "text-destructive"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">総閲覧数</p>
              <p className="text-3xl font-bold text-foreground">
                {totalViews.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10">
              <DollarSign className="h-7 w-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">総取引額</p>
              <p className="text-3xl font-bold text-foreground">
                {formatPrice(totalRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>最近の出品</CardTitle>
            <CardDescription>直近に出品された商品</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Package className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sellerName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.views} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Negotiations */}
        <Card>
          <CardHeader>
            <CardTitle>最近の交渉</CardTitle>
            <CardDescription>直近の交渉活動</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNegotiations.map((negotiation) => (
                <div
                  key={negotiation.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {negotiation.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {negotiation.buyerName} → {negotiation.sellerName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(negotiation.currentOffer)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {negotiation.status === "pending" && "交渉中"}
                      {negotiation.status === "accepted" && "承認済み"}
                      {negotiation.status === "rejected" && "却下"}
                      {negotiation.status === "countered" && "カウンター"}
                      {negotiation.status === "completed" && "完了"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
