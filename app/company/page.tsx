"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Calendar,
  MapPin,
  Globe,
  Award,
  Target,
  Lightbulb,
} from "lucide-react";

const companyInfo = [
  { label: "会社名", value: "株式会社インダストリアルマーケット" },
  { label: "代表取締役", value: "山田 太郎" },
  { label: "設立", value: "2020年4月1日" },
  { label: "資本金", value: "5,000万円" },
  { label: "従業員数", value: "45名（2024年1月現在）" },
  { label: "所在地", value: "東京都渋谷区〇〇1-2-3 〇〇ビル5F" },
  { label: "事業内容", value: "工業機器・産業設備のオンラインマーケットプレイス運営" },
  { label: "主要取引銀行", value: "三菱UFJ銀行、みずほ銀行" },
];

const history = [
  { year: "2020年4月", event: "株式会社インダストリアルマーケット設立" },
  { year: "2020年9月", event: "工業機器マーケットプレイス β版サービス開始" },
  { year: "2021年3月", event: "正式サービスローンチ" },
  { year: "2021年10月", event: "累計取引額10億円突破" },
  { year: "2022年4月", event: "シリーズAラウンド 資金調達完了" },
  { year: "2022年9月", event: "AI Spec Finder機能リリース" },
  { year: "2023年3月", event: "登録ユーザー数10,000社突破" },
  { year: "2023年8月", event: "累計取引額100億円突破" },
  { year: "2024年1月", event: "希望商品マッチング機能リリース" },
];

const values = [
  {
    icon: Target,
    title: "Mission",
    subtitle: "ミッション",
    description: "工業機器の流通に革新をもたらし、製造業の持続可能な発展に貢献する",
  },
  {
    icon: Lightbulb,
    title: "Vision",
    subtitle: "ビジョン",
    description: "世界中の工業機器がつながる、最も信頼されるマーケットプレイスになる",
  },
  {
    icon: Award,
    title: "Values",
    subtitle: "バリュー",
    description: "信頼・透明性・イノベーション・顧客第一",
  },
];

const team = [
  {
    name: "山田 太郎",
    position: "代表取締役 CEO",
    description: "大手機械メーカーにて15年の営業経験を持つ。工業機器業界の課題解決を目指し、2020年に当社を創業。",
  },
  {
    name: "鈴木 花子",
    position: "取締役 COO",
    description: "外資系コンサルティング会社出身。製造業のDX支援に従事した後、当社の事業拡大をリード。",
  },
  {
    name: "佐藤 健一",
    position: "取締役 CTO",
    description: "大手IT企業にてプラットフォーム開発を主導。AIを活用したマッチング技術の開発を担当。",
  },
  {
    name: "高橋 美咲",
    position: "執行役員 CFO",
    description: "公認会計士。大手監査法人での経験を経て、当社の財務戦略を統括。",
  },
];

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <Badge className="mb-4">会社情報</Badge>
          <h1 className="mb-4 text-3xl font-bold text-foreground">運営会社</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            工業機器の流通に革新をもたらし、製造業の発展に貢献します
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-primary">{value.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{value.subtitle}</p>
                  <p className="text-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Company Info */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                会社概要
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {companyInfo.map((item, index) => (
                      <tr
                        key={item.label}
                        className={index !== companyInfo.length - 1 ? "border-b border-border" : ""}
                      >
                        <th className="w-40 py-4 text-left font-medium text-muted-foreground">
                          {item.label}
                        </th>
                        <td className="py-4 text-foreground">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* History */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                沿革
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[72px] top-0 h-full w-0.5 bg-border md:left-24" />
                <div className="space-y-6">
                  {history.map((item, index) => (
                    <div key={index} className="relative flex items-start gap-4 md:gap-6">
                      <div className="w-16 shrink-0 text-right text-sm font-medium text-muted-foreground md:w-20">
                        {item.year}
                      </div>
                      <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full bg-primary" />
                      <div className="flex-1 text-foreground">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Leadership Team */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                経営陣
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {team.map((member) => (
                  <div
                    key={member.name}
                    className="rounded-lg border border-border bg-card p-6"
                  >
                    <div className="mb-3 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.position}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Office Location */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                アクセス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="mb-4 font-medium">本社オフィス</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-foreground">〒150-0001</p>
                        <p className="text-foreground">東京都渋谷区〇〇1-2-3 〇〇ビル5F</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">最寄り駅</p>
                        <p className="text-foreground">JR山手線「渋谷駅」徒歩5分</p>
                        <p className="text-foreground">東京メトロ「渋谷駅」B3出口 徒歩3分</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <MapPin className="mr-2 h-5 w-5" />
                    地図（Google Maps）
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
