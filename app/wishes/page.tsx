"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Search, Bell, BellOff, Calendar, Target, ChevronRight, Trash2, Pause, Play, Mail, MicOff as MailOff } from "lucide-react";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "有効", variant: "default" },
  paused: { label: "一時停止", variant: "secondary" },
  fulfilled: { label: "達成", variant: "outline" },
  expired: { label: "期限切れ", variant: "destructive" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function WishesPage() {
  const { wishes, wishMatches, updateWish, deleteWish, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter wishes for current user
  const userWishes = wishes.filter((w) => 
    currentUser ? w.userId === currentUser.id : w.userId === "user-001"
  );

  const filteredWishes = userWishes.filter((wish) => {
    const matchesSearch = wish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wish.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || wish.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getMatchCount = (wishId: string) => {
    return wishMatches.filter((m) => m.wishId === wishId).length;
  };

  const getUnreadMatchCount = (wishId: string) => {
    return wishMatches.filter((m) => m.wishId === wishId && !m.notified).length;
  };

  const handleToggleStatus = (wishId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    updateWish(wishId, { status: newStatus as "active" | "paused" });
  };

  const handleToggleEmail = (wishId: string, currentValue: boolean) => {
    updateWish(wishId, { emailNotification: !currentValue });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">希望商品リスト</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                希望条件を登録すると、条件に合う商品が出品された際に通知を受け取れます
              </p>
            </div>
            <Link href="/wishes/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                希望を登録
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="希望を検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="active">有効</SelectItem>
                    <SelectItem value="paused">一時停止</SelectItem>
                    <SelectItem value="fulfilled">達成</SelectItem>
                    <SelectItem value="expired">期限切れ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Wish List */}
          {filteredWishes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Target className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium text-foreground">希望商品がありません</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  希望条件を登録して、条件に合う商品の通知を受け取りましょう
                </p>
                <Link href="/wishes/new" className="mt-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    希望を登録
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredWishes.map((wish) => {
                const matchCount = getMatchCount(wish.id);
                const unreadCount = getUnreadMatchCount(wish.id);
                const status = statusLabels[wish.status];

                return (
                  <Card key={wish.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        {/* Main Content */}
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant={status.variant}>{status.label}</Badge>
                            {wish.emailNotification && (
                              <Badge variant="outline" className="text-xs">
                                <Mail className="mr-1 h-3 w-3" />
                                メール通知
                              </Badge>
                            )}
                            {unreadCount > 0 && (
                              <Badge className="bg-destructive text-destructive-foreground">
                                {unreadCount}件の新着マッチ
                              </Badge>
                            )}
                          </div>
                          
                          <Link href={`/wishes/${wish.id}`}>
                            <h3 className="text-lg font-semibold text-foreground transition-colors hover:text-primary">
                              {wish.title}
                            </h3>
                          </Link>
                          
                          {wish.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {wish.description}
                            </p>
                          )}

                          {/* Criteria Tags */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {wish.criteria.category && (
                              <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                                {wish.criteria.category}
                              </span>
                            )}
                            {wish.criteria.brand && (
                              <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                                {wish.criteria.brand}
                              </span>
                            )}
                            {wish.criteria.priceMax && (
                              <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                                ~{formatPrice(wish.criteria.priceMax)}
                              </span>
                            )}
                            {wish.criteria.condition && wish.criteria.condition.length > 0 && (
                              <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                                {wish.criteria.condition.map((c) => 
                                  c === "new" ? "新品" : c === "used" ? "中古" : "整備済"
                                ).join("/")}
                              </span>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              <span>マッチ閾値: {wish.matchThreshold}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              <span>マッチ数: {matchCount}件</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>作成: {formatDate(wish.createdAt)}</span>
                            </div>
                            {wish.expiresAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>期限: {formatDate(wish.expiresAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleEmail(wish.id, wish.emailNotification)}
                            title={wish.emailNotification ? "メール通知をオフ" : "メール通知をオン"}
                          >
                            {wish.emailNotification ? (
                              <Mail className="h-4 w-4" />
                            ) : (
                              <MailOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(wish.id, wish.status)}
                            title={wish.status === "active" ? "一時停止" : "有効化"}
                          >
                            {wish.status === "active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="削除">
                                <Trash2 className="h-4 w-4 text-destructive" />
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
                                  onClick={() => deleteWish(wish.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  削除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Link href={`/wishes/${wish.id}`}>
                            <Button variant="outline" size="sm">
                              詳細
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AISpecFinder />
    </div>
  );
}
