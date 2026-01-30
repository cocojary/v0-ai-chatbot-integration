"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { products } from "@/lib/mock-data";
import type { ChatMessage, Product, ExtractedSpec, ProductMatch, SpecMatch } from "@/lib/types";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Package,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  Filter,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

// Extract specifications from natural language query
function extractSpecs(query: string): ExtractedSpec {
  const spec: ExtractedSpec = {
    keywords: [],
  };

  // Extract measurement type
  const typePatterns = [
    { pattern: /(ガス|気体|gas)/i, type: "gas" },
    { pattern: /(温度|熱|temperature)/i, type: "temperature" },
    { pattern: /(圧力|pressure)/i, type: "pressure" },
    { pattern: /(流量|flow)/i, type: "flow" },
  ];

  for (const { pattern, type } of typePatterns) {
    if (pattern.test(query)) {
      spec.type = type;
      break;
    }
  }

  // Extract range (e.g., "0-100ppm", "0.1-10 ppm")
  const rangeMatch = query.match(/([\d.]+)\s*[-~〜]\s*([\d.]+)\s*(ppm|mm|kg|kw|mpa|℃|°c)/i);
  if (rangeMatch) {
    spec.range = {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
      unit: rangeMatch[3].toLowerCase(),
    };
  }

  // Extract accuracy (e.g., "±2%", "精度2%")
  const accuracyMatch = query.match(/[±]?\s*(\d+\.?\d*)\s*%/i);
  if (accuracyMatch) {
    spec.accuracy = `±${accuracyMatch[1]}%`;
  }

  // Extract brand preference
  const brands = ["横河電機", "堀場製作所", "オムロン", "キーエンス", "東京計器", "日立", "三菱"];
  for (const brand of brands) {
    if (query.includes(brand)) {
      spec.brand = brand;
      break;
    }
  }

  // Extract price constraint
  const priceMatch = query.match(/(\d+)\s*(万円|円)\s*(以下|未満|まで)/i);
  if (priceMatch) {
    const amount = parseInt(priceMatch[1]);
    const unit = priceMatch[2];
    spec.priceMax = unit.includes("万") ? amount * 10000 : amount;
  }

  // Extract condition preference
  if (/(新品|new)/i.test(query)) {
    spec.condition = "new";
  } else if (/(中古|used)/i.test(query)) {
    spec.condition = "used";
  }

  // Extract general keywords
  const keywords = query
    .toLowerCase()
    .split(/[\s,、。]+/)
    .filter((k) => k.length > 1);
  spec.keywords = keywords;

  return spec;
}

// Calculate spec match details
function calculateSpecMatch(product: Product, spec: ExtractedSpec): SpecMatch {
  const match: SpecMatch = {
    matched: [],
    partial: [],
    missing: [],
    notMatched: [],
  };

  // Check type match
  if (spec.type) {
    const productType = product.subcategory || product.category;
    if (productType.includes(spec.type)) {
      match.matched.push(`測定タイプ: ${spec.type}`);
    } else {
      match.notMatched.push(`測定タイプ: ${spec.type}が適合しない`);
    }
  }

  // Check range match
  if (spec.range) {
    const specValues = Object.entries(product.specifications);
    let rangeFound = false;
    
    for (const [key, value] of specValues) {
      const valueStr = value.toLowerCase();
      if (valueStr.includes(spec.range.unit)) {
        rangeFound = true;
        const numMatch = valueStr.match(/([\d.]+)\s*[-~]\s*([\d.]+)/);
        if (numMatch) {
          const prodMin = parseFloat(numMatch[1]);
          const prodMax = parseFloat(numMatch[2]);
          if (prodMin <= spec.range.min && prodMax >= spec.range.max) {
            match.matched.push(`${key}: ${value}（要求範囲をカバー）`);
          } else {
            match.partial.push(`${key}: ${value}（範囲が部分的に適合）`);
          }
        } else {
          match.partial.push(`${key}: ${value}`);
        }
        break;
      }
    }
    
    if (!rangeFound) {
      match.missing.push(`測定範囲: ${spec.range.min}-${spec.range.max}${spec.range.unit}`);
    }
  }

  // Check accuracy
  if (spec.accuracy) {
    const accuracySpec = Object.entries(product.specifications).find(
      ([key]) => key.includes("精度") || key.includes("accuracy")
    );
    
    if (accuracySpec) {
      match.matched.push(`${accuracySpec[0]}: ${accuracySpec[1]}`);
    } else {
      match.missing.push(`精度: ${spec.accuracy}`);
    }
  }

  // Check brand
  if (spec.brand) {
    if (product.manufacturer.includes(spec.brand)) {
      match.matched.push(`メーカー: ${product.manufacturer}`);
    } else {
      match.notMatched.push(`メーカー: ${spec.brand}ではない`);
    }
  }

  // Check price
  if (spec.priceMax) {
    if (product.price <= spec.priceMax) {
      match.matched.push(`価格: ${formatPrice(product.price)}（予算内）`);
    } else {
      match.notMatched.push(`価格: ${formatPrice(product.price)}（予算超過）`);
    }
  }

  // Check condition
  if (spec.condition) {
    if (product.condition === spec.condition) {
      match.matched.push(`状態: ${product.condition === "new" ? "新品" : "中古"}`);
    } else {
      match.notMatched.push(`状態: ${spec.condition}ではない`);
    }
  }

  return match;
}

// Score product match
function scoreProductMatch(product: Product, spec: ExtractedSpec): number {
  let score = 0;

  // Keyword matching (basic relevance)
  const searchText = `
    ${product.name} 
    ${product.description} 
    ${product.manufacturer} 
    ${product.category} 
    ${product.subcategory || ""}
    ${Object.values(product.specifications).join(" ")}
  `.toLowerCase();

  const matchedKeywords = spec.keywords.filter((k) => searchText.includes(k)).length;
  score += matchedKeywords * 10;

  // Range matching
  if (spec.range) {
    const specValues = Object.values(product.specifications).join(" ").toLowerCase();
    if (specValues.includes(spec.range.unit)) {
      score += 30;
    }
  }

  // Brand matching
  if (spec.brand && product.manufacturer.includes(spec.brand)) {
    score += 25;
  }

  // Price matching
  if (spec.priceMax && product.price <= spec.priceMax) {
    score += 20;
  } else if (spec.priceMax && product.price > spec.priceMax * 1.5) {
    score -= 30;
  }

  // Condition matching
  if (spec.condition && product.condition === spec.condition) {
    score += 15;
  }

  // Popularity bonus
  score += Math.min(product.views / 100, 10);
  score += Math.min(product.favorites * 2, 10);

  // New product bonus
  if (product.condition === "new") {
    score += 5;
  }

  return Math.max(0, score);
}

// Find matching products with tier classification
function findMatchingProducts(spec: ExtractedSpec): ProductMatch[] {
  const matches: ProductMatch[] = [];

  for (const product of products) {
    const score = scoreProductMatch(product, spec);
    
    if (score > 10) {
      const specMatch = calculateSpecMatch(product, spec);
      
      let tier: "best" | "close" | "alternative" = "alternative";
      if (score >= 60 && specMatch.matched.length >= 3) {
        tier = "best";
      } else if (score >= 40 || specMatch.matched.length >= 2) {
        tier = "close";
      }

      let reason = "";
      if (specMatch.matched.length > 0) {
        reason = specMatch.matched.slice(0, 2).join("、");
      } else if (specMatch.partial.length > 0) {
        reason = "一部の条件に適合";
      } else {
        reason = "関連性のある製品";
      }

      matches.push({
        product,
        matchScore: score,
        matchTier: tier,
        specMatch,
        reason,
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// Generate response with spec analysis
function generateSpecResponse(query: string): {
  text: string;
  extractedSpec: ExtractedSpec;
  productMatches: ProductMatch[];
  allMatches: ProductMatch[];
} {
  const spec = extractSpecs(query);
  const matches = findMatchingProducts(spec);

  const bestMatches = matches.filter((m) => m.matchTier === "best").slice(0, 3);
  const closeMatches = matches.filter((m) => m.matchTier === "close").slice(0, 3);
  const alternatives = matches.filter((m) => m.matchTier === "alternative").slice(0, 2);

  let text = "";

  if (matches.length === 0) {
    text = "申し訳ございません。条件に一致する商品が見つかりませんでした。\n\n別の条件でお試しいただくか、条件を緩和してみてください。";
    return { text, extractedSpec: spec, productMatches: [], allMatches: [] };
  }

  // Summary
  text += `条件に合う商品を${matches.length}件見つけました。\n\n`;

  // Best matches
  if (bestMatches.length > 0) {
    text += `【最適な商品】\n`;
    text += `${bestMatches[0].product.manufacturer}の${bestMatches[0].product.model}が特におすすめです。\n`;
    text += `理由: ${bestMatches[0].reason}\n`;
  }

  // Close matches note
  if (closeMatches.length > 0 && bestMatches.length === 0) {
    text += `【条件に近い商品】\n`;
    text += `${closeMatches[0].product.name}が候補です。一部の条件に適合しています。\n`;
  }

  // Alternatives note
  if (alternatives.length > 0 && bestMatches.length === 0 && closeMatches.length === 0) {
    text += `【代替候補】\n`;
    text += `関連性のある商品を見つけました。詳細をご確認ください。\n`;
  }

  return {
    text,
    extractedSpec: spec,
    productMatches: [...bestMatches, ...closeMatches, ...alternatives].slice(0, 6),
    allMatches: matches,
  };
}

const suggestedQueries = [
  "測定範囲0-100ppmのガス分析計",
  "100万円以下のCNC旋盤",
  "新品の圧力計、精度±0.5%以下",
  "横河電機の流量計",
];

export function AISpecFinder() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [lastAllMatches, setLastAllMatches] = useState<ProductMatch[]>([]);
  const { chatMessages, addChatMessage, setLastSearchResults } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = generateSpecResponse(userMessage.content);

    // Save all matches for detail page
    if (response.allMatches.length > 0) {
      setLastQuery(userMessage.content);
      setLastAllMatches(response.allMatches);
      setLastSearchResults(userMessage.content, response.allMatches);
    }

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: response.text,
      productMatches: response.productMatches,
      extractedSpec: response.extractedSpec,
      timestamp: new Date().toISOString(),
    };

    setIsTyping(false);
    addChatMessage(assistantMessage);
  };

  const handleViewAllResults = () => {
    if (lastAllMatches.length > 0) {
      router.push("/search-results");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQueries = [
    "0-100ppmのガス分析計",
    "精度±0.5%の圧力計",
    "50万円以下のCNC旋盤",
    "温度範囲-50~400℃",
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label="AI Spec Finderを開く"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[420px] max-w-[calc(100vw-48px)] flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-primary px-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="font-semibold text-primary-foreground">AI Spec Finder</span>
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
          <div className="min-h-0 flex-1 overflow-y-auto p-4" ref={scrollRef}>
            {chatMessages.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium text-foreground">
                    仕様から最適な機器を見つけます
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    測定範囲、精度、メーカーなど、自然な言葉で条件を入力してください。AIが仕様を分析し、最適な製品を提案します。
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">例:</p>
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
                      className={`max-w-[90%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.content}</p>

                      {/* Extracted Spec Filters */}
                      {message.extractedSpec && message.role === "assistant" && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {message.extractedSpec.type && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Filter className="h-3 w-3" />
                              {message.extractedSpec.type}
                            </Badge>
                          )}
                          {message.extractedSpec.range && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Filter className="h-3 w-3" />
                              {message.extractedSpec.range.min}-{message.extractedSpec.range.max}
                              {message.extractedSpec.range.unit}
                            </Badge>
                          )}
                          {message.extractedSpec.accuracy && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Filter className="h-3 w-3" />
                              精度{message.extractedSpec.accuracy}
                            </Badge>
                          )}
                          {message.extractedSpec.brand && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Filter className="h-3 w-3" />
                              {message.extractedSpec.brand}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Product Matches with Tier Display */}
                      {message.productMatches && message.productMatches.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {/* View All Results Link */}
                          {lastAllMatches.length > 6 && (
                            <button
                              type="button"
                              onClick={handleViewAllResults}
                              className="flex w-full items-center justify-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              全{lastAllMatches.length}件の詳細を見る
                            </button>
                          )}
                          {["best", "close", "alternative"].map((tier) => {
                            const tierMatches = message.productMatches?.filter(
                              (m) => m.matchTier === tier
                            );
                            if (!tierMatches || tierMatches.length === 0) return null;

                            const tierLabels = {
                              best: "✅ 最適",
                              close: "⚠️ 条件に近い",
                              alternative: "💡 代替候補",
                            };

                            return (
                              <div key={tier}>
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    {tierLabels[tier as keyof typeof tierLabels]}
                                  </p>
                                  {tier === "alternative" && lastAllMatches.length > message.productMatches!.length && (
                                    <button
                                      type="button"
                                      onClick={handleViewAllResults}
                                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                                    >
                                      詳細をご確認
                                      <ExternalLink className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  {tierMatches.map((match) => (
                                    <Link
                                      key={match.product.id}
                                      href={`/products/${match.product.id}`}
                                      className="block"
                                    >
                                      <div className="rounded-md border border-border bg-card p-3 transition-colors hover:bg-accent">
                                        <div className="mb-2 flex items-start gap-2">
                                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-secondary">
                                            <Package className="h-5 w-5 text-muted-foreground" />
                                          </div>
                                          <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-medium text-card-foreground line-clamp-1">
                                              {match.product.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {match.product.manufacturer}
                                            </p>
                                            <p className="text-xs font-semibold text-primary">
                                              {formatPrice(match.product.price)}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Match Details */}
                                        <div className="space-y-1 border-t border-border pt-2">
                                          {match.specMatch.matched.length > 0 && (
                                            <div className="flex items-start gap-1.5">
                                              <CheckCircle2 className="h-3 w-3 shrink-0 text-green-600 mt-0.5" />
                                              <p className="text-xs text-muted-foreground line-clamp-2">
                                                {match.specMatch.matched.slice(0, 2).join("、")}
                                              </p>
                                            </div>
                                          )}
                                          {match.specMatch.partial.length > 0 && (
                                            <div className="flex items-start gap-1.5">
                                              <AlertCircle className="h-3 w-3 shrink-0 text-orange-500 mt-0.5" />
                                              <p className="text-xs text-muted-foreground line-clamp-1">
                                                {match.specMatch.partial[0]}
                                              </p>
                                            </div>
                                          )}
                                          {match.specMatch.missing.length > 0 && (
                                            <div className="flex items-start gap-1.5">
                                              <Info className="h-3 w-3 shrink-0 text-blue-500 mt-0.5" />
                                              <p className="text-xs text-muted-foreground line-clamp-1">
                                                未記載: {match.specMatch.missing[0]}
                                              </p>
                                            </div>
                                          )}
                                          {match.specMatch.notMatched.length > 0 && (
                                            <div className="flex items-start gap-1.5">
                                              <XCircle className="h-3 w-3 shrink-0 text-red-500 mt-0.5" />
                                              <p className="text-xs text-muted-foreground line-clamp-1">
                                                {match.specMatch.notMatched[0]}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
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
          </div>

          {/* Input */}
          <div className="h-[76px] shrink-0 border-t border-border bg-card p-4">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="仕様を自然な言葉で入力..."
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
