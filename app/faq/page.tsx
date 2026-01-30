"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  UserCog,
  Package,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const faqCategories = [
  {
    id: "general",
    name: "サービス全般",
    icon: HelpCircle,
    faqs: [
      {
        question: "このサービスは何ですか？",
        answer: "工業機器・産業設備の中古売買に特化したマーケットプレイスです。計測機器、加工機械、電気制御機器など、幅広いカテゴリーの工業製品を売買できます。",
      },
      {
        question: "利用料金はかかりますか？",
        answer: "会員登録・商品閲覧・出品は無料です。取引成立時に、販売価格の5%を手数料としていただきます。購入者側には手数料はかかりません。",
      },
      {
        question: "法人でも利用できますか？",
        answer: "はい、個人・法人問わずご利用いただけます。法人アカウントでは請求書払いや複数担当者アカウントなど、ビジネス向け機能もご用意しています。",
      },
      {
        question: "海外からの利用は可能ですか？",
        answer: "現在は日本国内のみでのサービス提供となっております。海外への発送・海外からの出品には対応しておりません。",
      },
    ],
  },
  {
    id: "buying",
    name: "購入について",
    icon: ShoppingCart,
    faqs: [
      {
        question: "商品の状態はどのように確認できますか？",
        answer: "各商品ページに状態（新品・中古・整備済み）、製造年、使用履歴、付属品情報が記載されています。不明点は出品者に直接質問することも可能です。",
      },
      {
        question: "AI Spec Finderとは何ですか？",
        answer: "仕様や条件を入力すると、AIが最適な商品を提案する機能です。例えば「精度±0.5%の圧力計」と入力すると、条件に合う商品を自動で検索・提案します。",
      },
      {
        question: "希望商品を登録するメリットは？",
        answer: "探している商品の条件を登録しておくと、条件に合う新着商品が出品された際に自動で通知を受け取れます。効率的に目的の機器を見つけられます。",
      },
      {
        question: "価格交渉はできますか？",
        answer: "はい、商品ページから「交渉する」ボタンで出品者と直接交渉できます。希望価格や条件を伝えて、合意に達すれば取引に進めます。",
      },
      {
        question: "商品が届かない場合はどうすればいいですか？",
        answer: "まずは出品者に連絡してください。解決しない場合は、カスタマーサポートまでご連絡ください。取引保証制度により、適切に対応いたします。",
      },
    ],
  },
  {
    id: "selling",
    name: "出品について",
    icon: Package,
    faqs: [
      {
        question: "出品できる商品の条件は？",
        answer: "工業機器・産業設備であれば基本的に出品可能です。ただし、法令に違反する物品、危険物、動作しない機器（ジャンク品として明記する場合を除く）は出品できません。",
      },
      {
        question: "出品手数料はいくらですか？",
        answer: "出品自体は無料です。取引が成立した場合のみ、販売価格の5%を手数料としていただきます。",
      },
      {
        question: "商品写真は何枚まで登録できますか？",
        answer: "最大10枚まで登録できます。外観、銘板、付属品、傷や汚れがある場合はその箇所など、詳細が分かる写真を掲載することで購入者の安心感が高まります。",
      },
      {
        question: "購入希望者へのアプローチ方法は？",
        answer: "「購入希望者」ページで、あなたの商品にマッチする希望条件を持つユーザーを確認できます。マッチ度が高い希望者には直接メッセージを送ることができます。",
      },
      {
        question: "売上金の受け取り方法は？",
        answer: "取引完了後、登録した銀行口座に振り込まれます。振込は月2回（15日・月末締め、翌5営業日払い）です。最低振込額は1,000円からです。",
      },
    ],
  },
  {
    id: "payment",
    name: "支払いについて",
    icon: CreditCard,
    faqs: [
      {
        question: "利用できる支払い方法は？",
        answer: "銀行振込、クレジットカード（VISA、MasterCard、JCB、AMEX）、代金引換に対応しています。法人アカウントでは請求書払いも選択できます。",
      },
      {
        question: "支払い期限はいつですか？",
        answer: "購入手続き完了後、銀行振込の場合は7日以内、クレジットカードは即時決済となります。期限内にお支払いがない場合、取引はキャンセルとなります。",
      },
      {
        question: "領収書は発行できますか？",
        answer: "はい、マイページの取引履歴から領収書をPDFでダウンロードできます。宛名の変更も可能です。",
      },
      {
        question: "返金はどのように行われますか？",
        answer: "取引キャンセルや返品が承認された場合、元の支払い方法に返金されます。クレジットカードは1-2週間、銀行振込は5営業日程度かかります。",
      },
    ],
  },
  {
    id: "shipping",
    name: "配送について",
    icon: Truck,
    faqs: [
      {
        question: "配送業者は選べますか？",
        answer: "出品者が配送方法を指定します。大型機器の場合は専門の運送業者、小型機器は宅配便が一般的です。詳細は各商品ページをご確認ください。",
      },
      {
        question: "配送料は誰が負担しますか？",
        answer: "商品ごとに出品者が設定します。「送料込み」「着払い」「別途見積もり」などのパターンがあり、商品ページに明記されています。",
      },
      {
        question: "大型機器の搬入設置は対応していますか？",
        answer: "一部の出品者では搬入設置サービスを提供しています。必要な場合は事前に出品者にご相談ください。別途費用がかかる場合があります。",
      },
      {
        question: "配送中の破損はどうなりますか？",
        answer: "配送中の破損は配送業者の補償対象となります。商品受取時に必ず外観と動作を確認し、問題があれば受取前に申告してください。",
      },
    ],
  },
  {
    id: "safety",
    name: "安全・セキュリティ",
    icon: Shield,
    faqs: [
      {
        question: "個人情報は安全ですか？",
        answer: "SSL暗号化通信により、すべてのデータは安全に保護されています。個人情報は取引に必要な範囲でのみ使用し、第三者への提供は行いません。",
      },
      {
        question: "取引保証制度とは？",
        answer: "商品が届かない、説明と著しく異なる場合などに、購入代金を保証する制度です。条件を満たす場合、全額返金の対象となります。",
      },
      {
        question: "悪質なユーザーへの対策は？",
        answer: "本人確認制度、取引評価システム、24時間監視体制により、不正行為を防止しています。問題のあるユーザーはアカウント停止の対象となります。",
      },
      {
        question: "不審な取引を見つけた場合は？",
        answer: "カスタマーサポートまでご連絡ください。調査の上、適切な対応を行います。通報者の情報は保護されます。",
      },
    ],
  },
  {
    id: "account",
    name: "アカウント",
    icon: UserCog,
    faqs: [
      {
        question: "パスワードを忘れた場合は？",
        answer: "ログインページの「パスワードをお忘れの方」からリセットできます。登録メールアドレスに再設定用のリンクが送信されます。",
      },
      {
        question: "メールアドレスを変更したい",
        answer: "マイページの「アカウント設定」から変更できます。変更後は新しいメールアドレスで確認手続きが必要です。",
      },
      {
        question: "退会したい場合は？",
        answer: "マイページの「アカウント設定」から退会手続きができます。進行中の取引がある場合は、完了後に退会可能となります。",
      },
      {
        question: "アカウントが停止された場合は？",
        answer: "利用規約違反の可能性があります。詳細はカスタマーサポートまでお問い合わせください。",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  const displayCategories = selectedCategory
    ? filteredCategories.filter((c) => c.id === selectedCategory)
    : filteredCategories;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <Badge className="mb-4">サポート</Badge>
          <h1 className="mb-4 text-3xl font-bold text-foreground">よくある質問</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            お客様からよくいただくご質問をまとめました。
            お探しの回答が見つからない場合は、お問い合わせください。
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="キーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            すべて
          </button>
          {faqCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="mx-auto max-w-3xl space-y-8">
          {displayCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {displayCategories.length === 0 && (
          <div className="py-12 text-center">
            <HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">該当する質問が見つかりません</h3>
            <p className="text-muted-foreground">
              別のキーワードで検索するか、お問い合わせください
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="mx-auto max-w-xl p-6">
            <h3 className="mb-2 text-lg font-medium">お探しの回答が見つかりませんか？</h3>
            <p className="mb-4 text-muted-foreground">
              カスタマーサポートチームがお手伝いします
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
            >
              お問い合わせ
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
