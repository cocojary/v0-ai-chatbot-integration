"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

          {/* Main Content - Two Column Layout */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Stats Overview */}
            <div className="space-y-6 lg:col-span-1">
              <div>
                <h2 className="mb-4 text-lg font-semibold">統計</h2>
                <div className="space-y-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">総出品数</p>
                          <p className="mt-2 text-3xl font-bold">{totalProducts}</p>
                        </div>
                        <Package className="h-10 w-10 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">出品中</p>
                          <p className="mt-2 text-3xl font-bold text-green-600">{activeProducts}</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-green-500/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">総閲覧数</p>
                          <p className="mt-2 text-3xl font-bold text-blue-600">{totalViews}</p>
                        </div>
                        <Eye className="h-10 w-10 text-blue-500/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">お気に入り</p>
                          <p className="mt-2 text-3xl font-bold text-red-600">{totalFavorites}</p>
                        </div>
                        <Users className="h-10 w-10 text-red-500/20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Filters Sidebar */}
              <div>
                <h2 className="mb-4 text-lg font-semibold">フィルター</h2>
                <Card>
                  <CardContent className="space-y-4 p-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ステータス</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべて</SelectItem>
                          <SelectItem value="available">出品中</SelectItem>
                          <SelectItem value="sold">売却済み</SelectItem>
                          <SelectItem value="draft">下書き</SelectItem>
                          <SelectItem value="paused">一時停止</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ソート</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">最新順</SelectItem>
                          <SelectItem value="oldest">古い順</SelectItem>
                          <SelectItem value="price-high">価格が高い順</SelectItem>
                          <SelectItem value="price-low">価格が低い順</SelectItem>
                          <SelectItem value="views">閲覧数が多い順</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: Product List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search & Header */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">商品一覧</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="商品名・型番で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Product List */}
              {filteredProducts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground">商品がみつかりません</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          {/* Product Image */}
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground/30" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">{product.model}</p>
                                <Badge variant={statusLabels[product.status].variant} className="mt-2">
                                  {statusLabels[product.status].label}
                                </Badge>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
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
                                    {product.status === "available" ? (
                                      <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        一時停止
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        再開
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    削除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Product Stats */}
                            <div className="mt-3 flex gap-4 text-sm">
                              <div>
                                <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                              </div>
                              <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {product.views}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {product.favorites}
                                </div>
                                <div className="text-xs">
                                  {new Date(product.createdAt).toLocaleDateString("ja-JP")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
