"use client";

import React from "react"

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "メール",
    value: "support@industrial-market.jp",
    description: "24時間受付（返信は1-2営業日）",
  },
  {
    icon: Phone,
    title: "電話",
    value: "03-1234-5678",
    description: "平日 9:00-18:00",
  },
  {
    icon: MapPin,
    title: "所在地",
    value: "東京都渋谷区〇〇1-2-3",
    description: "〇〇ビル 5F",
  },
  {
    icon: Clock,
    title: "営業時間",
    value: "平日 9:00-18:00",
    description: "土日祝は休業",
  },
];

const inquiryTypes = [
  { value: "general", label: "サービスに関する一般的なお問い合わせ" },
  { value: "buying", label: "購入に関するお問い合わせ" },
  { value: "selling", label: "出品に関するお問い合わせ" },
  { value: "payment", label: "決済・支払いに関するお問い合わせ" },
  { value: "shipping", label: "配送に関するお問い合わせ" },
  { value: "trouble", label: "トラブル・クレーム" },
  { value: "partnership", label: "法人・パートナーシップのお問い合わせ" },
  { value: "media", label: "取材・メディア関連" },
  { value: "other", label: "その他" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    orderId: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-foreground">
              お問い合わせを受け付けました
            </h1>
            <p className="mb-6 text-muted-foreground">
              お問い合わせいただきありがとうございます。
              内容を確認の上、1-2営業日以内にご連絡いたします。
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              確認メールを {formData.email} にお送りしました。
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              新しいお問い合わせ
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <Badge className="mb-4">サポート</Badge>
          <h1 className="mb-4 text-3xl font-bold text-foreground">お問い合わせ</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            ご質問・ご要望などございましたら、お気軽にお問い合わせください。
            専門スタッフが丁寧にお答えします。
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Methods */}
            <div className="space-y-4 lg:col-span-1">
              <h2 className="mb-4 text-lg font-semibold">お問い合わせ方法</h2>
              {contactMethods.map((method) => (
                <Card key={method.title}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <method.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.title}</h3>
                      <p className="text-sm font-medium text-foreground">{method.value}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* FAQ Link */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-medium">よくある質問</h3>
                      <p className="mb-2 text-sm text-muted-foreground">
                        お問い合わせの前によくある質問をご確認ください
                      </p>
                      <a href="/faq" className="text-sm font-medium text-primary hover:underline">
                        FAQを見る →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>お問い合わせフォーム</CardTitle>
                <CardDescription>
                  必須項目（*）をご入力の上、送信してください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        お名前 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="山田 太郎"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">会社名</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="株式会社〇〇"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        メールアドレス <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="example@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">電話番号</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="03-1234-5678"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">
                      お問い合わせ種別 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderId">注文番号・取引ID（該当する場合）</Label>
                    <Input
                      id="orderId"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      placeholder="例: ORD-12345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      お問い合わせ内容 <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="お問い合わせ内容をご記入ください"
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        お問い合わせいただいた内容は、
                        <a href="/privacy" className="text-primary hover:underline">
                          プライバシーポリシー
                        </a>
                        に基づき適切に管理いたします。
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "送信中..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        送信する
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
