"use client";

import React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/mock-data";
import type { Category } from "@/lib/types";
import {
  ChevronRight,
  Grid3X3,
  List,
  SlidersHorizontal,
  Gauge,
  Cog,
  Bot,
  Zap,
  Wind,
  FlaskRound,
  Package,
} from "lucide-react";
import { AIChatbox } from "@/components/ai-chatbox"; // Import AIChatbox component

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gauge: Gauge,
  cog: Cog,
  robot: Bot,
  zap: Zap,
  wind: Wind,
  flask: FlaskRound,
};

interface CategoryDetailClientProps {
  category: Category;
}

export function CategoryDetailClient({ category }: CategoryDetailClientProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [conditionFilter, setConditionFilter] = useState<string>("all");

  const Icon = iconMap[category.icon] || Gauge;

  const categoryProducts = useMemo(() => {
    let filtered = products.filter((p) => p.category === category.id);

    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (conditionFilter !== "all") {
      filtered = filtered.filter((p) => p.condition === conditionFilter);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return filtered;
  }, [category.id, selectedSubcategory, sortBy, conditionFilter]);

  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    products.forEach((p) => {
      if (p.category === category.id) {
        counts.all++;
        if (p.subcategory) {
          counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
        }
      }
    });
    return counts;
  }, [category.id]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                ホーム
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link
                href="/categories"
                className="text-muted-foreground hover:text-foreground"
              >
                カテゴリー
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {category.nameJa}
              </span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <div className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">
                  {category.nameJa}
                </h1>
                <p className="mt-1 text-lg text-muted-foreground">
                  {category.name}
                </p>
                <p className="mt-3 text-muted-foreground">
                  {getCategoryDescription(category.id)}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    <Package className="mr-1 h-4 w-4" />
                    {subcategoryCounts.all}件の商品
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Filters */}
            <aside className="w-full shrink-0 lg:w-64">
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    フィルター
                  </h3>

                  {/* Subcategories */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-medium text-foreground">
                      サブカテゴリー
                    </h4>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSubcategory("all")}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          selectedSubcategory === "all"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        }`}
                      >
                        <span>すべて</span>
                        <Badge
                          variant={
                            selectedSubcategory === "all"
                              ? "secondary"
                              : "outline"
                          }
                          className="ml-2"
                        >
                          {subcategoryCounts.all}
                        </Badge>
                      </button>
                      {category.subcategories.map((sub) => (
                        <button
                          type="button"
                          key={sub.id}
                          onClick={() => setSelectedSubcategory(sub.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                            selectedSubcategory === sub.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{sub.nameJa}</span>
                          <Badge
                            variant={
                              selectedSubcategory === sub.id
                                ? "secondary"
                                : "outline"
                            }
                            className="ml-2"
                          >
                            {subcategoryCounts[sub.id] || 0}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Condition Filter */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-foreground">
                      状態
                    </h4>
                    <div className="space-y-2">
                      {[
                        { id: "all", label: "すべて" },
                        { id: "new", label: "新品" },
                        { id: "used", label: "中古" },
                        { id: "refurbished", label: "整備済" },
                      ].map((cond) => (
                        <button
                          type="button"
                          key={cond.id}
                          onClick={() => setConditionFilter(cond.id)}
                          className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                            conditionFilter === cond.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-foreground hover:bg-muted"
                          }`}
                        >
                          {cond.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and View Controls */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {categoryProducts.length}件
                  </span>
                  の商品が見つかりました
                </p>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="並び替え" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">新着順</SelectItem>
                      <SelectItem value="price-low">価格が安い順</SelectItem>
                      <SelectItem value="price-high">価格が高い順</SelectItem>
                      <SelectItem value="popular">人気順</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex rounded-lg border">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {categoryProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      商品が見つかりません
                    </h3>
                    <p className="mb-6 text-muted-foreground">
                      フィルター条件を変更してお試しください
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedSubcategory("all");
                        setConditionFilter("all");
                      }}
                    >
                      フィルターをリセット
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AISpecFinder />
    </div>
  );
}

function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    measurement:
      "ガス分析計、流量計、圧力計、温度計など、工場・プラント向けの高精度計測機器を取り揃えています。",
    processing:
      "CNCマシン、旋盤、フライス盤など、金属加工・機械加工に必要な工作機械を幅広く取り扱っています。",
    automation:
      "PLCコントローラー、ロボットアーム、コンベアシステムなど、生産ラインの自動化に必要な機器を提供しています。",
    electrical:
      "変圧器、インバーター、モーターなど、工場の電力システムに必要な電気機器を取り扱っています。",
    hvac: "チラー、エアハンドラー、コンプレッサーなど、工場・施設の空調・環境制御機器を提供しています。",
    laboratory:
      "分光計、顕微鏡、遠心分離機など、研究開発・品質管理に必要な分析・実験機器を取り揃えています。",
  };
  return descriptions[categoryId] || "産業機器を取り扱っています。";
}
