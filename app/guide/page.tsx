"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  Package,
  Shield,
  UserPlus,
  ListPlus,
  Bell,
  Target,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const guideSteps = [
  {
    title: "会員登録",
    icon: UserPlus,
    description: "まずは無料会員登録から始めましょう",
    steps: [
      "トップページ右上の「会員登録」ボタンをクリック",
      "メールアドレスとパスワードを入力",
      "届いた確認メールのリンクをクリックして登録完了",
      "プロフィール情報を入力して取引準備完了",
    ],
  },
  {
    title: "商品を探す",
    icon: Search,
    description: "豊富な検索機能で目的の機器を見つけましょう",
    steps: [
      "キーワード検索またはカテゴリーから商品を探す",
      "フィルター機能で価格帯・状態・メーカーなどを絞り込み",
      "AI Spec Finderで仕様を指定して最適な商品を提案",
      "気になる商品はお気に入りに登録",
    ],
  },
  {
    title: "希望商品を登録",
    icon: Target,
    description: "探している機器を登録すると自動でマッチング",
    steps: [
      "「希望商品」ページから新規登録",
      "カテゴリー・仕様・予算などの条件を設定",
      "条件に合う商品が出品されると自動通知",
      "マッチした商品をすぐに確認・交渉開始",
    ],
  },
  {
    title: "交渉する",
    icon: MessageSquare,
    description: "出品者と直接交渉できます",
    steps: [
      "商品ページから「交渉する」ボタンをクリック",
      "希望価格や条件をメッセージで伝える",
      "出品者からの返信を待つ（通常1-2営業日）",
      "合意に達したら取引手続きへ",
    ],
  },
  {
    title: "購入・決済",
    icon: CreditCard,
    description: "安心・安全な決済システム",
    steps: [
      "交渉成立後、購入手続きへ進む",
      "配送先住所と支払い方法を選択",
      "銀行振込・クレジットカード・代金引換に対応",
      "決済完了後、出品者へ通知",
    ],
  },
  {
    title: "商品受取・評価",
    icon: Package,
    description: "商品到着後の流れ",
    steps: [
      "出品者が商品を発送（追跡番号をお知らせ）",
      "商品到着後、動作確認を実施",
      "問題なければ「受取完了」ボタンをクリック",
      "取引評価を入力して取引完了",
    ],
  },
];

const sellerGuide = [
  {
    title: "商品を出品する",
    icon: ListPlus,
    description: "簡単ステップで出品完了",
    steps: [
      "「出品する」ボタンから出品ページへ",
      "商品情報（カテゴリー・仕様・状態）を入力",
      "商品写真を複数枚アップロード（最大10枚）",
      "価格と配送方法を設定して出品完了",
    ],
  },
  {
    title: "購入希望者を見つける",
    icon: Bell,
    description: "あなたの商品を探している人がいます",
    steps: [
      "「購入希望者」ページで潜在顧客を確認",
      "商品とマッチする希望条件を一覧表示",
      "マッチ度の高い希望者に直接アプローチ",
      "交渉成立率を高める積極的な営業活動",
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <Badge className="mb-4">初めての方へ</Badge>
          <h1 className="mb-4 text-3xl font-bold text-foreground">ご利用ガイド</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            工業機器マーケットプレイスの使い方を分かりやすくご説明します。
            購入から出品まで、安心してお取引いただけます。
          </p>
        </div>

        {/* Buyer Guide */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">購入者ガイド</h2>
              <p className="text-sm text-muted-foreground">商品の探し方から購入完了まで</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guideSteps.map((step, index) => (
              <Card key={step.title} className="relative overflow-hidden">
                <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary/30">
                  {index + 1}
                </div>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.steps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seller Guide */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">出品者ガイド</h2>
              <p className="text-sm text-muted-foreground">商品の出品から販売まで</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sellerGuide.map((step, index) => (
              <Card key={step.title} className="relative overflow-hidden">
                <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-3xl font-bold text-orange-500/30">
                  {index + 1}
                </div>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                    <step.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.steps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>安全なお取引のために</CardTitle>
                  <p className="text-sm text-muted-foreground">トラブル防止のポイント</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-background p-4">
                  <h4 className="mb-2 font-medium">本人確認済みユーザー</h4>
                  <p className="text-sm text-muted-foreground">
                    本人確認済みバッジのあるユーザーとの取引を推奨します
                  </p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <h4 className="mb-2 font-medium">商品の詳細確認</h4>
                  <p className="text-sm text-muted-foreground">
                    購入前に仕様・状態・付属品を必ず確認しましょう
                  </p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <h4 className="mb-2 font-medium">プラットフォーム内決済</h4>
                  <p className="text-sm text-muted-foreground">
                    必ずプラットフォーム内の決済システムをご利用ください
                  </p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <h4 className="mb-2 font-medium">評価を確認</h4>
                  <p className="text-sm text-muted-foreground">
                    取引相手の評価・レビューを事前にチェックしましょう
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">
            ご不明な点がございましたら、お気軽にお問い合わせください
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-medium hover:bg-accent"
            >
              よくある質問を見る
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
