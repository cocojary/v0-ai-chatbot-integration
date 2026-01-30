"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { products } from "@/lib/mock-data";
import type { ChatMessage, Product } from "@/lib/types";
import { Bot, Send, X, Sparkles, Package } from "lucide-react";
import Link from "next/link";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  const keywords = lowerQuery.split(/[\s,、。]+/).filter(Boolean);

  return products.filter((product) => {
    const searchText = `
      ${product.name} 
      ${product.description} 
      ${product.manufacturer} 
      ${product.category} 
      ${product.subcategory || ""} 
      ${Object.values(product.specifications).join(" ")}
    `.toLowerCase();

    // Check for price range queries
    const priceMatch = query.match(/(\d+)[\s]*(万|円)/);
    if (priceMatch) {
      const amount = parseInt(priceMatch[1]);
      const unit = priceMatch[2];
      const targetPrice = unit === "万" ? amount * 10000 : amount;
      if (product.price > targetPrice * 1.5) return false;
    }

    // Check for measurement range queries (e.g., "0-100ppm")
    const rangeMatch = query.match(/(\d+)-(\d+)\s*(ppm|mm|kg|kw)/i);
    if (rangeMatch) {
      const specValues = Object.values(product.specifications).join(" ").toLowerCase();
      if (!specValues.includes(rangeMatch[0].toLowerCase())) {
        // Check if the range is mentioned in specs
        return false;
      }
    }

    return keywords.some((keyword) => searchText.includes(keyword));
  });
}

function getRecommendationReason(product: Product, query: string): string {
  const reasons: string[] = [];

  // Check for specification matches
  const rangeMatch = query.match(/(\d+)-(\d+)\s*(ppm|mm|kg|kw|mpa)/i);
  if (rangeMatch) {
    const specValues = Object.entries(product.specifications);
    for (const [key, value] of specValues) {
      if (value.toLowerCase().includes(rangeMatch[0].toLowerCase())) {
        reasons.push(`${key}が${value}で要求仕様に適合`);
        break;
      }
    }
  }

  // Check for condition
  if (product.condition === "new") {
    reasons.push("新品で保証付き");
  } else if (product.condition === "refurbished") {
    reasons.push("整備済みで品質保証");
  }

  // Check for price advantage
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    reasons.push(`${discount}%割引でお得`);
  }

  // Check for manufacturer reputation
  const reputableBrands = ["横河電機", "堀場製作所", "オムロン", "キーエンス", "東京計器"];
  if (reputableBrands.includes(product.manufacturer)) {
    reasons.push("信頼性の高いメーカー");
  }

  // Default reason based on category
  if (reasons.length === 0) {
    reasons.push("ご要望に合致する仕様");
  }

  return reasons.join("、");
}

function generateResponse(query: string): { text: string; products: Product[] } {
  const foundProducts = searchProducts(query);

  if (foundProducts.length === 0) {
    return {
      text: "申し訳ございません。お探しの条件に一致する商品が見つかりませんでした。別のキーワードでお試しください。例: 「ガス分析計」「CNC旋盤」「100万円以下の計測機器」など。",
      products: [],
    };
  }

  let responseText = "";
  const topProducts = foundProducts.slice(0, 3);

  if (query.includes("ガス") || query.includes("分析")) {
    responseText = `条件に合う商品を${foundProducts.length}件見つけました。`;
    if (topProducts.length > 0) {
      const topProduct = topProducts[0];
      const reason = getRecommendationReason(topProduct, query);
      responseText += `\n\n特に${topProduct.manufacturer}の${topProduct.model}がおすすめです。理由: ${reason}。`;
    }
  } else if (query.includes("CNC") || query.includes("旋盤") || query.includes("加工")) {
    responseText = `加工機器を${foundProducts.length}件見つけました。`;
    if (topProducts.length > 0) {
      const topProduct = topProducts[0];
      responseText += `\n\n${topProduct.name}は高精度な加工が可能で、${getRecommendationReason(topProduct, query)}です。`;
    }
  } else if (query.includes("ロボット") || query.includes("自動化")) {
    responseText = `自動化・ロボット機器を${foundProducts.length}件見つけました。`;
    if (topProducts.length > 0) {
      responseText += `\n\n生産性向上に最適な機器を揃えています。特に${topProducts[0].name}は${getRecommendationReason(topProducts[0], query)}でおすすめです。`;
    }
  } else if (query.includes("安い") || query.includes("格安") || query.includes("万円以下")) {
    responseText = `お求めやすい価格の商品を${foundProducts.length}件見つけました。`;
    if (topProducts.length > 0) {
      responseText += `\n\nコストパフォーマンスに優れた機器を厳選しています。`;
    }
  } else {
    responseText = `条件に合う商品を${foundProducts.length}件見つけました。`;
    if (topProducts.length > 0) {
      const topProduct = topProducts[0];
      responseText += `\n\n${topProduct.manufacturer}の${topProduct.model}がおすすめです。理由: ${getRecommendationReason(topProduct, query)}。`;
    }
  }

  // Add product list summary
  if (topProducts.length > 1) {
    responseText += `\n\n以下の${topProducts.length}件の商品が特に条件に適合しています:`;
    topProducts.forEach((p, idx) => {
      responseText += `\n${idx + 1}. ${p.name} - ${getRecommendationReason(p, query)}`;
    });
  }

  return {
    text: responseText,
    products: topProducts,
  };
}

export function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { chatMessages, addChatMessage, clearChatMessages } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize with demo data on first open
  useEffect(() => {
    if (isOpen && !hasInitialized && chatMessages.length === 0) {
      const demoUserMessage: ChatMessage = {
        id: "demo-user-1",
        role: "user",
        content: "測定範囲0-100ppmのガス分析計を探しています",
        timestamp: new Date(Date.now() - 60000).toISOString(),
      };

      const gasProducts = products.filter(
        (p) => p.subcategory === "gas-analyzer" || p.name.includes("ガス")
      ).slice(0, 3);

      const demoAssistantMessage: ChatMessage = {
        id: "demo-assistant-1",
        role: "assistant",
        content: `条件に合う商品を3件見つけました。\n\n特に横河電機のGA-500がおすすめです。理由: 測定範囲が0-100ppmで要求仕様に適合、信頼性の高いメーカー。\n\n以下の3件の商品が特に条件に適合しています:\n1. ${gasProducts[0]?.name || "ガス分析計 GA-500"} - 測定範囲が要求仕様に適合、信頼性の高いメーカー\n2. ${gasProducts[1]?.name || "ポータブルガス検知器"} - 新品で保証付き、持ち運び可能\n3. ${gasProducts[2]?.name || "マルチガスモニター"} - コストパフォーマンスに優れた機器`,
        products: gasProducts.length > 0 ? gasProducts : undefined,
        timestamp: new Date(Date.now() - 50000).toISOString(),
      };

      addChatMessage(demoUserMessage);
      setTimeout(() => {
        addChatMessage(demoAssistantMessage);
      }, 100);
      
      setHasInitialized(true);
    }
  }, [isOpen, hasInitialized, chatMessages.length, addChatMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 800));

    const response = generateResponse(userMessage.content);

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: response.text,
      products: response.products,
      timestamp: new Date().toISOString(),
    };

    setIsTyping(false);
    addChatMessage(assistantMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQueries = [
    "0-100ppmの計測機器",
    "CNC旋盤",
    "100万円以下",
    "ロボットアーム",
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label="AIアシスタントを開く"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] max-w-[calc(100vw-48px)] flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="font-semibold text-primary-foreground">
                AIアシスタント
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {chatMessages.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-foreground">
                    こんにちは! 産業機器の検索をお手伝いします。
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    例: 「測定範囲0-100ppmのガス分析計」「100万円以下のCNC旋盤」など、自然な言葉でお探しください。
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    よく検索されるキーワード:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.map((query) => (
                      <Button
                        key={query}
                        variant="outline"
                        size="sm"
                        className="h-auto px-3 py-1.5 text-xs bg-transparent"
                        onClick={() => {
                          setInput(query);
                          textareaRef.current?.focus();
                        }}
                      >
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.products && message.products.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.id}`}
                              className="block"
                            >
                              <div className="flex items-start gap-3 rounded-md bg-card p-2 transition-colors hover:bg-accent">
                                <div className="flex h-12 w-12 items-center justify-center rounded bg-secondary">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p className="truncate text-xs font-medium text-card-foreground">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {product.manufacturer}
                                  </p>
                                  <p className="text-xs font-semibold text-primary">
                                    {formatPrice(product.price)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-lg bg-muted px-4 py-2">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="機器を探す..."
                className="min-h-[44px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-11 w-11 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
