"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Package,
  Settings,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const typeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  wish_match: { label: "希望マッチ", icon: <Target className="h-4 w-4" />, color: "text-primary" },
  seller_potential_buyer: { label: "購入希望者", icon: <Users className="h-4 w-4" />, color: "text-orange-500" },
  negotiation: { label: "交渉", icon: <MessageSquare className="h-4 w-4" />, color: "text-blue-500" },
  transaction: { label: "取引", icon: <Package className="h-4 w-4" />, color: "text-green-500" },
  system: { label: "システム", icon: <Settings className="h-4 w-4" />, color: "text-muted-foreground" },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "たった今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, currentUser } = useAppStore();
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter notifications for current user
  const userNotifications = notifications.filter((n) =>
    currentUser ? n.userId === currentUser.id : n.userId === "user-001"
  );

  const filteredNotifications = userNotifications.filter((notif) => {
    return typeFilter === "all" || notif.type === typeFilter;
  });

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getNotificationLink = (notif: typeof notifications[0]): string => {
    if (notif.type === "wish_match" && notif.data?.productId) {
      return `/products/${notif.data.productId}`;
    }
    if (notif.type === "seller_potential_buyer" && notif.data?.productId) {
      return `/my-products/potential-buyers`;
    }
    if (notif.type === "negotiation" && notif.data?.negotiationId) {
      return `/negotiations/${notif.data.negotiationId}`;
    }
    if (notif.type === "transaction" && notif.data?.transactionId) {
      return `/transactions/${notif.data.transactionId}`;
    }
    return "#";
  };

  const handleNotificationClick = (notifId: string) => {
    markNotificationRead(notifId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">通知一覧</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount}件の未読通知があります` : "すべての通知を確認済みです"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllNotificationsRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                すべて既読にする
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">フィルター:</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="wish_match">希望マッチ</SelectItem>
                    <SelectItem value="negotiation">交渉</SelectItem>
                    <SelectItem value="transaction">取引</SelectItem>
                    <SelectItem value="system">システム</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification List */}
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BellOff className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium text-foreground">通知がありません</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  新しい通知があればここに表示されます
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notif) => {
                const typeInfo = typeLabels[notif.type];
                const link = getNotificationLink(notif);

                return (
                  <Card
                    key={notif.id}
                    className={`transition-all hover:shadow-md ${!notif.read ? "border-primary/30 bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`mt-1 shrink-0 rounded-full bg-secondary p-2 ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {typeInfo.label}
                            </Badge>
                            {!notif.read && (
                              <Badge variant="default" className="text-xs">
                                未読
                              </Badge>
                            )}
                            {notif.data?.matchScore && (
                              <Badge variant="secondary" className="text-xs">
                                マッチ度 {notif.data.matchScore}%
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(notif.createdAt)}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground">{notif.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {notif.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                          {!notif.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleNotificationClick(notif.id)}
                              title="既読にする"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {link !== "#" && (
                            <Link href={link} onClick={() => handleNotificationClick(notif.id)}>
                              <Button variant="outline" size="sm">
                                詳細
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Quick Links */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-base">関連リンク</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/wishes" className="group">
                  <div className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary">希望商品リスト</p>
                      <p className="text-sm text-muted-foreground">希望条件の管理</p>
                    </div>
                  </div>
                </Link>
                <Link href="/negotiations" className="group">
                  <div className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary">交渉一覧</p>
                      <p className="text-sm text-muted-foreground">進行中の交渉</p>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <AISpecFinder />
    </div>
  );
}
