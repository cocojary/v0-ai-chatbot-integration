"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { products as allProducts } from "@/lib/mock-data";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
};

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  available: { label: "出品中", variant: "default" },
  sold: { label: "売却済み", variant: "secondary" },
  draft: { label: "下書き", variant: "outline" },
  paused: { label: "一時停止", variant: "destructive" },
};

const conditionLabels: Record<string, string> = {
  new: "新品",
  used: "中古",
  refurbished: "整備済み",
};

export default function MyProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Demo: Filter products by seller-001
  const myProducts = allProducts.filter((p) => p.sellerId === "seller-001");

  // Apply filters
  let filteredProducts = myProducts;
  
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (statusFilter !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.status === statusFilter);
  }

  // Sort
  if (sortBy === "newest") {
    filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === "oldest") {
    filteredProducts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "views") {
    filteredProducts.sort((a, b) => b.views - a.views);
  }

  // Stats
  const totalProducts = myProducts.length;
  const activeProducts = myProducts.filter((p) => p.status === "available").length;
  const totalViews = myProducts.reduce((sum, p) => sum + p.views, 0);
  const totalFavorites = myProducts.reduce((sum, p) => sum + p.favorites, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">出品商品管理</h1>
              <p className="text-muted-foreground">出品中の商品を管理します</p>
            </div>
            <Link href="/sell">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新規出品
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">総出品数</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">出品中</p>
                  <p className="text-2xl font-bold">{activeProducts}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">総閲覧数</p>
                  <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-full bg-red-500/10 p-3">
                  <Users className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">お気に入り</p>
                  <p className="text-2xl font-bold">{totalFavorites}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">商品一覧</TabsTrigger>
              <TabsTrigger value="analytics">アナリティクス</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="商品名・型番で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="available">出品中</SelectItem>
                    <SelectItem value="sold">売却済み</SelectItem>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="paused">一時停止</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="並び替え" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">新しい順</SelectItem>
                    <SelectItem value="oldest">古い順</SelectItem>
                    <SelectItem value="price-high">価格が高い順</SelectItem>
                    <SelectItem value="price-low">価格が低い順</SelectItem>
                    <SelectItem value="views">閲覧数順</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products List */}
              {filteredProducts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mb-2 text-lg font-medium">商品がありません</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      条件に一致する商品が見つかりませんでした
                    </p>
                    <Link href="/sell">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        新規出品
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => {
                    const status = statusLabels[product.status] || statusLabels.available;
                    return (
                      <Card key={product.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image */}
                            <div className="relative aspect-video w-full sm:aspect-square sm:w-48">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-secondary">
                                  <Package className="h-12 w-12 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="mb-1 flex items-center gap-2">
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                    <Badge variant="outline">{conditionLabels[product.condition]}</Badge>
                                  </div>
                                  <Link href={`/products/${product.id}`}>
                                    <h3 className="mb-1 text-lg font-semibold hover:text-primary">
                                      {product.name}
                                    </h3>
                                  </Link>
                                  <p className="text-sm text-muted-foreground">
                                    {product.manufacturer} / {product.model}
                                  </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      編集
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      プレビュー
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      一時停止
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      削除
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="mt-auto flex flex-col gap-4 pt-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-primary">
                                    {formatPrice(product.price)}
                                  </p>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <p className="text-sm text-muted-foreground line-through">
                                      {formatPrice(product.originalPrice)}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{product.views}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{product.favorites}</span>
                                  </div>
                                  <span>出品日: {product.createdAt}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardContent className="py-16 text-center">
                  <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium">アナリティクス</h3>
                  <p className="text-sm text-muted-foreground">
                    商品の閲覧数やお気に入り数の推移を確認できます
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    (デモ版では詳細なアナリティクスは表示されません)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
