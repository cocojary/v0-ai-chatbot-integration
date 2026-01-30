"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { Negotiation, NegotiationMessage } from "@/lib/types";
import { Package, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

interface NegotiateClientProps {
  productId: string;
}

export function NegotiateClient({ productId }: NegotiateClientProps) {
  const router = useRouter();
  const product = products.find((p) => p.id === productId);
  const { currentUser, addNegotiation } = useAppStore();

  const [offerPrice, setOfferPrice] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!product) {
    notFound();
  }

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const offer = parseInt(offerPrice) || product.price;

    const newMessage: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: message,
      offer: offer,
      createdAt: new Date().toISOString(),
    };

    const newNegotiation: Negotiation = {
      id: `neg-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      status: "pending",
      initialOffer: offer,
      currentOffer: offer,
      messages: [newMessage],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addNegotiation(newNegotiation);
    router.push("/negotiations");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/products/${product.id}`} className="hover:text-foreground">
              {product.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">交渉を始める</span>
          </nav>

          {/* Product Summary */}
          <Card className="mb-6">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-secondary">
                <Package className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
                <h2 className="font-semibold text-foreground">{product.name}</h2>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Negotiation Form */}
          <Card>
            <CardHeader>
              <CardTitle>交渉を始める</CardTitle>
              <CardDescription>
                希望価格とメッセージを入力して、出品者に交渉リクエストを送信してください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="offerPrice">希望価格</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">¥</span>
                    <Input
                      id="offerPrice"
                      type="number"
                      placeholder={product.price.toString()}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    出品価格: {formatPrice(product.price)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">メッセージ *</Label>
                  <Textarea
                    id="message"
                    placeholder="購入目的や希望条件などをお伝えください..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    交渉が成立した場合、エスクロー決済により安全にお取引いただけます。
                    商品確認後に代金が出品者に支払われます。
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.back()}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      "交渉リクエストを送信"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
