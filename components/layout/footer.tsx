import Link from "next/link";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">Industrial</span>
                <span className="text-lg font-bold text-primary">Market</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              産業機器の売買プラットフォーム。
              <br />
              安心・安全な取引をサポートします。
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">サービス</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground">
                  商品を探す
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-foreground">
                  出品する
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">
                  カテゴリー
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">サポート</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/guide" className="hover:text-foreground">
                  ご利用ガイド
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">会社情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/company" className="hover:text-foreground">
                  運営会社
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 - Techzen- IndustrialMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
