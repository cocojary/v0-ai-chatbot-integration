"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AISpecFinder } from "@/components/ai-spec-finder";
import { ProductCard } from "@/components/product-card";
import { CategoryCard } from "@/components/category-card";
import { categories, products } from "@/lib/mock-data";
import { ArrowRight, Shield, Truck, MessageSquare, Sparkles } from "lucide-react";
import { AIChatbox } from "@/components/ai-chatbox"; // Import AIChatbox component

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const recentProducts = products.slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  産業機器の
                  <span className="text-primary">売買</span>を
                  <br />
                  もっとシンプルに
                </h1>
                <p className="max-w-md text-lg text-muted-foreground">
                  計測機器、加工機器、自動化設備など。
                  AIアシスタントで最適な機器を素早く見つけましょう。
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/products">
                      商品を探す
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/sell">出品する</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
                <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">AIアシスタント</span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-sm text-muted-foreground">
                        「測定範囲0-100ppmのガス分析計を探しています」
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <p className="text-sm text-foreground">
                        条件に合う商品を3件見つけました。横河電機のGA-500がおすすめです。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">安心取引</h3>
                  <p className="text-sm text-muted-foreground">
                    エスクロー決済で安全な取引を実現
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">配送サポート</h3>
                  <p className="text-sm text-muted-foreground">
                    大型機器の配送・設置もお任せ
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">価格交渉</h3>
                  <p className="text-sm text-muted-foreground">
                    売り手と直接交渉が可能
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">カテゴリー</h2>
                <p className="text-muted-foreground">
                  幅広い産業機器をカバー
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/categories">
                  すべて見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">注目の商品</h2>
                <p className="text-muted-foreground">
                  人気の高い商品をピックアップ
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/products?sort=popular">
                  すべて見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Products */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">新着商品</h2>
                <p className="text-muted-foreground">
                  最近出品された商品
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/products?sort=newest">
                  すべて見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              不要な機器をお持ちですか？
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
              使わなくなった産業機器を出品してみませんか？
              簡単な手続きで、必要としている企業に届けることができます。
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sell">
                今すぐ出品する
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <AISpecFinder />
    </div>
  );
}
