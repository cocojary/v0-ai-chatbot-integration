"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, UserCheck, Database, Share2, Clock, Mail } from "lucide-react";

const privacySections = [
  {
    icon: Eye,
    title: "1. 収集する情報",
    content: `当社は、本サービスの提供にあたり、以下の情報を収集します。

【ユーザーから直接取得する情報】
• 氏名、会社名、部署名、役職
• メールアドレス、電話番号、住所
• 銀行口座情報（売上金の振込用）
• クレジットカード情報（決済代行会社を通じて）
• プロフィール情報（任意で登録いただく情報）

【サービス利用に伴い取得する情報】
• 取引履歴、閲覧履歴、検索履歴
• お問い合わせ内容、メッセージ履歴
• IPアドレス、ブラウザ情報、デバイス情報
• Cookie情報、アクセスログ`,
  },
  {
    icon: Database,
    title: "2. 情報の利用目的",
    content: `当社は、収集した情報を以下の目的で利用します。

• 本サービスの提供、運営、改善
• ユーザー認証、アカウント管理
• 取引の円滑な遂行（決済処理、配送手配等）
• カスタマーサポートの提供
• 利用状況の分析、統計データの作成
• サービスに関するお知らせ、マーケティング情報の配信
• 不正利用の防止、セキュリティの確保
• 法令に基づく対応`,
  },
  {
    icon: Share2,
    title: "3. 情報の第三者提供",
    content: `当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。

• ユーザーの同意がある場合
• 取引の相手方に対し、取引遂行に必要な範囲で提供する場合
• 決済代行会社、配送業者等の業務委託先に提供する場合
• 法令に基づき開示が求められた場合
• 人の生命、身体または財産の保護のために必要がある場合
• 公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合

【業務委託先】
当社は、以下の業務を外部に委託しており、委託に必要な範囲で個人情報を提供します。
• 決済処理：株式会社〇〇ペイメント
• メール配信：〇〇株式会社
• カスタマーサポート：〇〇株式会社
• クラウドサーバー：Amazon Web Services, Inc.`,
  },
  {
    icon: Lock,
    title: "4. 情報の安全管理",
    content: `当社は、個人情報の漏洩、滅失、毀損を防止するため、以下のセキュリティ対策を実施しています。

【技術的対策】
• SSL/TLS暗号化通信の使用
• ファイアウォール、不正侵入検知システムの導入
• データベースの暗号化
• 定期的なセキュリティ監査の実施

【組織的対策】
• 個人情報保護方針の策定と周知
• 従業員への定期的な教育・研修
• アクセス権限の最小化
• 入退室管理、監視カメラの設置

【物理的対策】
• サーバールームの施錠管理
• 耐震・耐火設備の完備
• バックアップデータの安全な保管`,
  },
  {
    icon: UserCheck,
    title: "5. ユーザーの権利",
    content: `ユーザーは、自己の個人情報について、以下の権利を有します。

• 開示請求：保有する個人情報の開示を求める権利
• 訂正請求：誤った情報の訂正を求める権利
• 削除請求：個人情報の削除を求める権利
• 利用停止請求：利用の停止または消去を求める権利
• 第三者提供の停止請求：第三者への提供の停止を求める権利

これらの請求を行う場合は、本人確認の上、当社所定の手続きに従ってお申し出ください。
なお、法令に基づき保存が義務付けられている情報等、一部対応できない場合があります。

【請求先】
お問い合わせフォーム、またはメール（privacy@industrial-market.jp）よりご連絡ください。`,
  },
  {
    icon: Clock,
    title: "6. 情報の保存期間",
    content: `当社は、利用目的の達成に必要な期間、個人情報を保存します。

• アカウント情報：退会後5年間
• 取引情報：取引完了後7年間（法令に基づく保存義務）
• お問い合わせ情報：対応完了後3年間
• アクセスログ：取得後1年間

保存期間経過後は、安全な方法で削除または匿名化します。`,
  },
  {
    icon: Shield,
    title: "7. Cookieの使用",
    content: `当社は、本サービスにおいてCookieを使用しています。

【使用目的】
• ログイン状態の維持
• ユーザー設定の保存
• 利用状況の分析（Google Analyticsを使用）
• 広告の最適化（該当する場合）

【Cookieの管理】
ブラウザの設定により、Cookieの受け入れを拒否することができます。
ただし、一部の機能が利用できなくなる場合があります。`,
  },
  {
    icon: Mail,
    title: "8. お問い合わせ窓口",
    content: `個人情報の取扱いに関するお問い合わせは、下記までご連絡ください。

株式会社インダストリアルマーケット
個人情報保護管理責任者

〒150-0001 東京都渋谷区〇〇1-2-3 〇〇ビル5F
メール：privacy@industrial-market.jp
電話：03-1234-5678（平日9:00-18:00）`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <Badge className="mb-4">会社情報</Badge>
          <h1 className="mb-4 text-3xl font-bold text-foreground">プライバシーポリシー</h1>
          <p className="text-sm text-muted-foreground">
            最終更新日: 2024年1月1日
          </p>
        </div>

        {/* Introduction */}
        <Card className="mx-auto mb-8 max-w-4xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-2 text-lg font-semibold">個人情報保護方針</h2>
                <p className="text-sm text-muted-foreground">
                  株式会社インダストリアルマーケット（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と考え、
                  以下のとおりプライバシーポリシーを定め、個人情報の適切な取扱いと保護に努めます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="mx-auto max-w-4xl space-y-6">
          {privacySections.map((section, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                </div>
                <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {section.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mx-auto mt-8 max-w-4xl text-center">
          <Card>
            <CardContent className="p-6">
              <p className="mb-2 text-sm text-muted-foreground">
                本プライバシーポリシーは、法令の改正や当社の方針変更により、予告なく変更されることがあります。
                変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">制定日: 2020年4月1日</p>
                <p className="text-sm text-muted-foreground">最終改定日: 2024年1月1日</p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  株式会社インダストリアルマーケット
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
