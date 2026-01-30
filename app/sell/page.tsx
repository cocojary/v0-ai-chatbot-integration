"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { Loader2, Upload, Plus, X } from "lucide-react";

export default function SellPage() {
  const router = useRouter();
  const { currentUser, addProduct } = useAppStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    manufacturer: "",
    model: "",
    year: "",
    condition: "used" as "new" | "used" | "refurbished",
    location: "",
  });
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const handleAddSpec = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const specsObject: Record<string, string> = {};
    specifications.forEach((spec) => {
      if (spec.key && spec.value) {
        specsObject[spec.key] = spec.value;
      }
    });

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      category: formData.category,
      manufacturer: formData.manufacturer,
      model: formData.model,
      year: formData.year ? parseInt(formData.year) : undefined,
      condition: formData.condition,
      location: formData.location,
      images: [],
      specifications: specsObject,
      sellerId: currentUser.id,
      sellerName: currentUser.company || currentUser.name,
      createdAt: new Date().toISOString().split("T")[0],
      status: "available",
      views: 0,
      favorites: 0,
    };

    addProduct(newProduct);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">商品を出品</h1>
            <p className="text-muted-foreground">
              出品情報を入力してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
                <CardDescription>商品の基本的な情報を入力してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">商品名 *</Label>
                  <Input
                    id="name"
                    placeholder="例: ガス分析計 GA-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">商品説明 *</Label>
                  <Textarea
                    id="description"
                    placeholder="商品の状態、特徴、使用歴などを詳しく記載してください"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={5}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">カテゴリー *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nameJa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">状態 *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value: "new" | "used" | "refurbished") =>
                        setFormData((prev) => ({ ...prev, condition: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">新品</SelectItem>
                        <SelectItem value="used">中古</SelectItem>
                        <SelectItem value="refurbished">整備済</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>商品詳細</CardTitle>
                <CardDescription>製品の詳細情報を入力してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">メーカー *</Label>
                    <Input
                      id="manufacturer"
                      placeholder="例: 横河電機"
                      value={formData.manufacturer}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">型番 *</Label>
                    <Input
                      id="model"
                      placeholder="例: GA-500"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, model: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="year">製造年</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="例: 2021"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, year: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">所在地 *</Label>
                    <Input
                      id="location"
                      placeholder="例: 東京都大田区"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>仕様</CardTitle>
                <CardDescription>商品の仕様を入力してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="項目名（例: 測定範囲）"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="値（例: 0-100ppm）"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                      className="flex-1"
                    />
                    {specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSpec(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddSpec}>
                  <Plus className="mr-2 h-4 w-4" />
                  仕様を追加
                </Button>
              </CardContent>
            </Card>

            {/* Price */}
            <Card>
              <CardHeader>
                <CardTitle>価格設定</CardTitle>
                <CardDescription>販売価格を設定してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">販売価格 *</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">¥</span>
                      <Input
                        id="price"
                        type="number"
                        placeholder="850000"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, price: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">定価（参考）</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">¥</span>
                      <Input
                        id="originalPrice"
                        type="number"
                        placeholder="1200000"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>商品画像</CardTitle>
                <CardDescription>商品の画像をアップロードしてください（最大10枚）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      クリックまたはドラッグ&ドロップ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
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
                    出品中...
                  </>
                ) : (
                  "出品する"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
