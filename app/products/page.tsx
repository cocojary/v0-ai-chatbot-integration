"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { products, categories } from "@/lib/mock-data";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { AIChatbox } from "@/components/ai-chatbox"; // Import AIChatbox component

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "popular";
type ConditionFilter = "all" | "new" | "used" | "refurbished";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<ConditionFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.manufacturer.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Condition filter
    if (selectedCondition !== "all") {
      filtered = filtered.filter((p) => p.condition === selectedCondition);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((p) => p.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter((p) => p.price <= parseInt(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedCondition, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setPriceRange({ min: "", max: "" });
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedCondition !== "all" ||
    priceRange.min ||
    priceRange.max;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <Label className="mb-2 block text-sm font-medium">カテゴリー</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nameJa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div>
        <Label className="mb-2 block text-sm font-medium">状態</Label>
        <div className="space-y-2">
          {[
            { value: "all", label: "すべて" },
            { value: "new", label: "新品" },
            { value: "used", label: "中古" },
            { value: "refurbished", label: "整備済" },
          ].map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`condition-${option.value}`}
                checked={selectedCondition === option.value}
                onCheckedChange={() =>
                  setSelectedCondition(option.value as ConditionFilter)
                }
              />
              <Label
                htmlFor={`condition-${option.value}`}
                className="text-sm font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-2 block text-sm font-medium">価格帯</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="最低"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-full"
          />
          <span className="text-muted-foreground">〜</span>
          <Input
            type="number"
            placeholder="最高"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-full"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="mr-2 h-4 w-4" />
          フィルターをクリア
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">商品一覧</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length}件の商品が見つかりました
            </p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 font-semibold text-foreground">絞り込み</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1">
              {/* Search and Sort Bar */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="キーワードで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden bg-transparent">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        絞り込み
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <h2 className="mb-6 text-lg font-semibold">絞り込み</h2>
                      <FilterContent />
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">新着順</SelectItem>
                      <SelectItem value="oldest">古い順</SelectItem>
                      <SelectItem value="price-low">価格が安い順</SelectItem>
                      <SelectItem value="price-high">価格が高い順</SelectItem>
                      <SelectItem value="popular">人気順</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="mb-2 text-lg font-medium text-foreground">
                    商品が見つかりませんでした
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    検索条件を変更してお試しください
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    フィルターをクリア
                  </Button>
                </div>
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
