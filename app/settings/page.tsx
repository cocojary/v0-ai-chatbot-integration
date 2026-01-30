"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { currentUser } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    name: currentUser?.name || "東京機械商事",
    email: currentUser?.email || "info@tokyo-kikai.co.jp",
    phone: "03-1234-5678",
    company: "東京機械商事株式会社",
    position: "営業部長",
    address: "東京都大田区蒲田1-2-3",
    description: "創業30年の産業機械専門商社です。中古計測機器、工作機械、FA機器を中心に取り扱っております。",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNewMessage: true,
    emailNegotiation: true,
    emailMatch: true,
    emailNews: false,
    pushNewMessage: true,
    pushNegotiation: true,
    pushMatch: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: true,
    showAddress: true,
    allowContact: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">設定</h1>
            <p className="text-muted-foreground">アカウント設定と通知設定を管理します</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">プロフィール</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">通知</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">プライバシー</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">お支払い</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    基本情報
                  </CardTitle>
                  <CardDescription>
                    プロフィール情報を編集します。この情報は取引相手に表示されます。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/avatars/seller-001.jpg" />
                      <AvatarFallback className="text-2xl">東</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="mr-2 h-4 w-4" />
                        画像を変更
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        JPG, PNG, GIF (最大2MB)
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">表示名</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">会社名</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">役職</Label>
                      <Input
                        id="position"
                        value={profile.position}
                        onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">メールアドレス</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">電話番号</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">所在地</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="address"
                          className="pl-10"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">自己紹介</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      placeholder="会社や取扱商品についての説明を入力してください"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  保存する
                </Button>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    メール通知
                  </CardTitle>
                  <CardDescription>
                    メールで受け取る通知を設定します
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">新着メッセージ</p>
                      <p className="text-sm text-muted-foreground">
                        新しいメッセージを受信した時に通知
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNewMessage}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNewMessage: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">交渉の更新</p>
                      <p className="text-sm text-muted-foreground">
                        交渉が進展した時に通知
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNegotiation}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNegotiation: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">新しいマッチング</p>
                      <p className="text-sm text-muted-foreground">
                        出品商品に購入希望者がマッチした時に通知
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailMatch}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailMatch: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">お知らせ・キャンペーン</p>
                      <p className="text-sm text-muted-foreground">
                        サービスのお知らせやキャンペーン情報
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNews}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNews: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    プッシュ通知
                  </CardTitle>
                  <CardDescription>
                    ブラウザのプッシュ通知を設定します
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">新着メッセージ</p>
                      <p className="text-sm text-muted-foreground">
                        リアルタイムでメッセージを通知
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNewMessage}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushNewMessage: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">交渉の更新</p>
                      <p className="text-sm text-muted-foreground">
                        交渉の進展をリアルタイムで通知
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNegotiation}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushNegotiation: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">新しいマッチング</p>
                      <p className="text-sm text-muted-foreground">
                        マッチングをリアルタイムで通知
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushMatch}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushMatch: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  保存する
                </Button>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    プライバシー設定
                  </CardTitle>
                  <CardDescription>
                    他のユーザーに表示する情報を設定します
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">メールアドレスを公開</p>
                      <p className="text-sm text-muted-foreground">
                        プロフィールにメールアドレスを表示
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showEmail: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">電話番号を公開</p>
                      <p className="text-sm text-muted-foreground">
                        プロフィールに電話番号を表示
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showPhone: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">所在地を公開</p>
                      <p className="text-sm text-muted-foreground">
                        プロフィールに所在地を表示
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showAddress}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showAddress: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">ダイレクトメッセージを許可</p>
                      <p className="text-sm text-muted-foreground">
                        他のユーザーからのメッセージを受け付ける
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowContact}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, allowContact: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  保存する
                </Button>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    お支払い方法
                  </CardTitle>
                  <CardDescription>
                    登録されているお支払い方法を管理します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <CreditCard className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mb-2 font-medium">お支払い方法が登録されていません</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      クレジットカードまたは銀行口座を登録してください
                    </p>
                    <Button variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      お支払い方法を追加
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>請求履歴</CardTitle>
                  <CardDescription>
                    過去の請求履歴を確認できます
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground py-8">
                    請求履歴はありません
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
