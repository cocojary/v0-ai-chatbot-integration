"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { categories } from "@/lib/mock-data";
import type { Wish, WishCriteria } from "@/lib/types";
import { ArrowLeft, Bell, Info, Plus, X } from "lucide-react";

export default function NewWishPage() {
  const router = useRouter();
  const { addWish, currentUser } = useAppStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("none");
  const [subcategory, setSubcategory] = useState<string>("none");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [yearMin, setYearMin] = useState<string>("");
  const [yearMax, setYearMax] = useState<string>("");
  const [conditions, setConditions] = useState<string[]>(["new", "used", "refurbished"]);
  const [matchThreshold, setMatchThreshold] = useState([60]);
  const [emailNotification, setEmailNotification] = useState(true);
  const [expiresIn, setExpiresIn] = useState<string>("90");

  const selectedCategory = categories.find((c) => c.id === category);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setConditions([...conditions, condition]);
    } else {
      setConditions(conditions.filter((c) => c !== condition));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const criteria: WishCriteria = {};
    if (category !== "none") criteria.category = category;
    if (subcategory !== "none") criteria.subcategory = subcategory;
    if (keywords.length > 0) criteria.keywords = keywords;
    if (brand) criteria.brand = brand;
    if (model) criteria.model = model;
    if (priceMin) criteria.priceMin = Number.parseInt(priceMin);
    if (priceMax) criteria.priceMax = Number.parseInt(priceMax);
    if (yearMin) criteria.yearMin = Number.parseInt(yearMin);
    if (yearMax) criteria.yearMax = Number.parseInt(yearMax);
    if (conditions.length > 0 && conditions.length < 3) {
      criteria.condition = conditions as ("new" | "used" | "refurbished")[];
    }

    const now = new Date();
    const expiresAt = expiresIn && expiresIn !== "unlimited"
      ? new Date(now.getTime() + Number.parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      userId: currentUser?.id || "user-001",
      userName: currentUser?.name || "田中太郎",
      title,
      description: description || undefined,
      criteria,
      matchThreshold: matchThreshold[0],
      status: "active",
      emailNotification,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt,
      matchCount: 0,
    };

    addWish(newWish);
    router.push("/wishes");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Back Button */}
          <Link
            href="/wishes"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            希望リストに戻る
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">希望商品を登録</CardTitle>
              <CardDescription>
                希望条件を設定すると、条件に合う商品が出品された際に通知を受け取れます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">基本情報</h3>
                  <div>
                    <Label htmlFor="title">タイトル *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="例: ガス分析計を探しています"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">詳細説明</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="希望条件の詳細を入力してください"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">カテゴリー</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>カテゴリー</Label>
                      <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory("none"); }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">指定なし</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nameJa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>サブカテゴリー</Label>
                      <Select
                        value={subcategory}
                        onValueChange={setSubcategory}
                        disabled={category === "none"}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">指定なし</SelectItem>
                          {selectedCategory?.subcategories.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.nameJa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">キーワード</h3>
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="キーワードを入力"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddKeyword}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm text-primary"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="rounded-full p-0.5 hover:bg-primary/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand & Model */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">メーカー・型番</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="brand">メーカー</Label>
                      <Input
                        id="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="例: 横河電機"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">型番</Label>
                      <Input
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="例: GA-500"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">価格帯</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="priceMin">最低価格</Label>
                      <Input
                        id="priceMin"
                        type="number"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priceMax">最高価格</Label>
                      <Input
                        id="priceMax"
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        placeholder="1000000"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Year Range */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">製造年</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="yearMin">最小年</Label>
                      <Input
                        id="yearMin"
                        type="number"
                        value={yearMin}
                        onChange={(e) => setYearMin(e.target.value)}
                        placeholder="2015"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearMax">最大年</Label>
                      <Input
                        id="yearMax"
                        type="number"
                        value={yearMax}
                        onChange={(e) => setYearMax(e.target.value)}
                        placeholder="2024"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">商品状態</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cond-new"
                        checked={conditions.includes("new")}
                        onCheckedChange={(checked) => handleConditionChange("new", !!checked)}
                      />
                      <Label htmlFor="cond-new">新品</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cond-used"
                        checked={conditions.includes("used")}
                        onCheckedChange={(checked) => handleConditionChange("used", !!checked)}
                      />
                      <Label htmlFor="cond-used">中古</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cond-refurbished"
                        checked={conditions.includes("refurbished")}
                        onCheckedChange={(checked) => handleConditionChange("refurbished", !!checked)}
                      />
                      <Label htmlFor="cond-refurbished">整備済</Label>
                    </div>
                  </div>
                </div>

                {/* Match Threshold */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">マッチ閾値</h3>
                    <span className="text-sm text-muted-foreground">({matchThreshold[0]}%)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={matchThreshold}
                      onValueChange={setMatchThreshold}
                      min={30}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                  </div>
                  <p className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                    マッチ度がこの値以上の商品が出品された時に通知されます。高く設定すると精度が上がりますが、通知が減ります。
                  </p>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">通知設定</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notif"
                      checked={emailNotification}
                      onCheckedChange={(checked) => setEmailNotification(!!checked)}
                    />
                    <Label htmlFor="email-notif" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      メールでも通知を受け取る
                    </Label>
                  </div>
                </div>

                {/* Expiration */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">有効期限</h3>
                  <Select value={expiresIn} onValueChange={setExpiresIn}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30日間</SelectItem>
                      <SelectItem value="60">60日間</SelectItem>
                      <SelectItem value="90">90日間</SelectItem>
                      <SelectItem value="180">180日間</SelectItem>
                      <SelectItem value="unlimited">無期限</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1 sm:flex-none">
                    希望を登録
                  </Button>
                  <Link href="/wishes">
                    <Button type="button" variant="outline">
                      キャンセル
                    </Button>
                  </Link>
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
