"use client";

import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { Package, MessageSquare, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { AIChatbox } from "@/components/ai-chatbox"; // Import AIChatbox component

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

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { label: "交渉中", variant: "default", icon: Clock },
  accepted: { label: "承認済み", variant: "secondary", icon: CheckCircle },
  rejected: { label: "却下", variant: "destructive", icon: XCircle },
  countered: { label: "カウンター提案", variant: "outline", icon: MessageSquare },
  completed: { label: "完了", variant: "secondary", icon: CheckCircle },
};

export default function NegotiationsPage() {
  const router = useRouter();
  const { currentUser, negotiations } = useAppStore();

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const buyerNegotiations = negotiations.filter((n) => n.buyerId === currentUser.id);
  const sellerNegotiations = negotiations.filter((n) => n.sellerId === currentUser.id);

  const NegotiationCard = ({ negotiation }: { negotiation: typeof negotiations[0] }) => {
    const status = statusConfig[negotiation.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
              <Package className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant={status.variant} className="shrink-0">
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {status.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(negotiation.updatedAt)}
                </span>
              </div>
              <h3 className="mb-1 truncate font-medium text-foreground">
                {negotiation.productName}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  提示価格:
                </span>
                <span className="font-semibold text-primary">
                  {formatPrice(negotiation.currentOffer)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {negotiation.messages[negotiation.messages.length - 1]?.content.slice(0, 50)}
                {negotiation.messages[negotiation.messages.length - 1]?.content.length > 50 && "..."}
              </p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/negotiations/${negotiation.id}`}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" className="mt-4 bg-transparent" asChild>
        <Link href="/products">商品を探す</Link>
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">交渉一覧</h1>
            <p className="text-muted-foreground">
              進行中の交渉と過去の取引履歴を確認できます
            </p>
          </div>

          <Tabs defaultValue="buying">
            <TabsList className="mb-6">
              <TabsTrigger value="buying">
                購入交渉 ({buyerNegotiations.length})
              </TabsTrigger>
              <TabsTrigger value="selling">
                販売交渉 ({sellerNegotiations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buying">
              {buyerNegotiations.length > 0 ? (
                <div className="space-y-4">
                  {buyerNegotiations.map((negotiation) => (
                    <NegotiationCard key={negotiation.id} negotiation={negotiation} />
                  ))}
                </div>
              ) : (
                <EmptyState message="購入交渉はまだありません" />
              )}
            </TabsContent>

            <TabsContent value="selling">
              {sellerNegotiations.length > 0 ? (
                <div className="space-y-4">
                  {sellerNegotiations.map((negotiation) => (
                    <NegotiationCard key={negotiation.id} negotiation={negotiation} />
                  ))}
                </div>
              ) : (
                <EmptyState message="販売交渉はまだありません" />
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
