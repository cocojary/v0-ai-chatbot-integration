"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/lib/store";
import type { NegotiationMessage } from "@/lib/types";
import {
  Package,
  ChevronRight,
  Send,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  pending: { label: "交渉中", variant: "default" },
  accepted: { label: "承認済み", variant: "secondary" },
  rejected: { label: "却下", variant: "destructive" },
  countered: { label: "カウンター提案", variant: "outline" },
  completed: { label: "完了", variant: "secondary" },
};

interface NegotiationDetailClientProps {
  id: string;
}

export function NegotiationDetailClient({ id }: NegotiationDetailClientProps) {
  const router = useRouter();
  const { currentUser, negotiations, updateNegotiation } = useAppStore();

  const [newMessage, setNewMessage] = useState("");
  const [newOffer, setNewOffer] = useState("");

  const negotiation = negotiations.find((n) => n.id === id);

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  if (!negotiation) {
    notFound();
  }

  const isSeller = currentUser.id === negotiation.sellerId;
  const canRespond = negotiation.status === "pending" || negotiation.status === "countered";
  const status = statusConfig[negotiation.status] || statusConfig.pending;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      offer: newOffer ? parseInt(newOffer) : undefined,
      createdAt: new Date().toISOString(),
    };

    updateNegotiation(negotiation.id, {
      messages: [...negotiation.messages, message],
      currentOffer: newOffer ? parseInt(newOffer) : negotiation.currentOffer,
      status: newOffer ? "countered" : negotiation.status,
      updatedAt: new Date().toISOString(),
    });

    setNewMessage("");
    setNewOffer("");
  };

  const handleAccept = () => {
    updateNegotiation(negotiation.id, {
      status: "accepted",
      updatedAt: new Date().toISOString(),
    });
  };

  const handleReject = () => {
    updateNegotiation(negotiation.id, {
      status: "rejected",
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/negotiations" className="hover:text-foreground">
              交渉一覧
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">交渉詳細</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <Card className="flex h-[600px] flex-col">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">メッセージ</CardTitle>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {negotiation.messages.map((message) => {
                      const isOwn = message.senderId === currentUser.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span className="text-xs font-medium">
                                {message.senderName}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.offer && (
                              <div className="mt-2 rounded bg-card/20 p-2 text-sm">
                                <span className="font-medium">提示価格: </span>
                                {formatPrice(message.offer)}
                              </div>
                            )}
                            <p className="mt-1 text-xs opacity-70">
                              {formatDateTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {canRespond && (
                  <div className="border-t border-border p-4">
                    <div className="mb-3 flex gap-2">
                      <Input
                        type="number"
                        placeholder="新しい提示価格（任意）"
                        value={newOffer}
                        onChange={(e) => setNewOffer(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="メッセージを入力..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={2}
                        className="flex-1 resize-none"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">商品情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/products/${negotiation.productId}`}>
                    <div className="flex items-center gap-3 rounded-lg transition-colors hover:bg-muted p-2 -m-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-medium text-foreground">
                          {negotiation.productName}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Price Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">価格情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">初回提示価格</span>
                    <span className="font-medium">{formatPrice(negotiation.initialOffer)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">現在の提示価格</span>
                    <span className="font-bold text-primary">
                      {formatPrice(negotiation.currentOffer)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions for Seller */}
              {isSeller && canRespond && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">アクション</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" onClick={handleAccept}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      承認する
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleReject}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      却下する
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Status Info */}
              {negotiation.status === "accepted" && (
                <Card className="border-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-accent">
                      <CheckCircle className="h-6 w-6" />
                      <div>
                        <p className="font-medium">交渉成立</p>
                        <p className="text-sm opacity-80">
                          決済手続きに進んでください
                        </p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full" asChild>
                      <Link href={`/checkout/${negotiation.id}`}>
                        決済に進む
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {negotiation.status === "rejected" && (
                <Card className="border-destructive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-destructive">
                      <XCircle className="h-6 w-6" />
                      <div>
                        <p className="font-medium">交渉不成立</p>
                        <p className="text-sm opacity-80">
                          この交渉は却下されました
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">取引参加者</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{negotiation.buyerName}</p>
                      <p className="text-xs text-muted-foreground">購入者</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{negotiation.sellerName}</p>
                      <p className="text-xs text-muted-foreground">出品者</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
