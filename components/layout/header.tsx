"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";
import {
  User,
  Menu,
  Heart,
  MessageSquare,
  ShoppingBag,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
  Bell,
  Target,
  Users, // Import Users icon
} from "lucide-react";

export function Header() {
  const { currentUser, setCurrentUser, favorites, notifications } = useAppStore();
  const unreadNotifications = notifications.filter((n) => !n.read && (currentUser ? n.userId === currentUser.id : n.userId === "user-001")).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground">Industrial</span>
            <span className="text-lg font-bold text-primary">Market</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            商品一覧
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            カテゴリー
          </Link>
          <Link
            href="/sell"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            出品
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/favorites">
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {favorites.length}
                    </span>
                  )}
                  <span className="sr-only">お気に入り</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                  <span className="sr-only">通知</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/negotiations">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">交渉</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">アカウント</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      ダッシュボード
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-products">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      出品商品
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-products/potential-buyers">
                      <Users className="mr-2 h-4 w-4" />
                      購入希望者
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishes">
                      <Target className="mr-2 h-4 w-4" />
                      希望商品
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      設定
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/login">ログイン</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">新規登録</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">メニュー</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/products"
                  className="text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  商品一覧
                </Link>
                <Link
                  href="/categories"
                  className="text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  カテゴリー
                </Link>
                <Link
                  href="/sell"
                  className="text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  出品する
                </Link>
                {!currentUser && (
                  <>
                    <hr className="my-2" />
                    <Link
                      href="/login"
                      className="text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
