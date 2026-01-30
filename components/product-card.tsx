"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { Heart, MapPin, Eye, Package } from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(price);
}

const conditionLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "新品", variant: "default" },
  used: { label: "中古", variant: "secondary" },
  refurbished: { label: "整備済", variant: "outline" },
};

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(product.id);

  const condition = conditionLabels[product.condition] || conditionLabels.used;

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="flex">
          <Link href={`/products/${product.id}`} className="shrink-0">
            <div className="relative h-40 w-48 overflow-hidden bg-secondary">
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
              <div className="absolute left-2 top-2">
                <Badge variant={condition.variant}>{condition.label}</Badge>
              </div>
            </div>
          </Link>
          <CardContent className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <h3 className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">{product.manufacturer} | {product.model}</p>
              <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.views}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute left-2 top-2 flex gap-1">
            <Badge variant={condition.variant}>{condition.label}</Badge>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product.id);
            }}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
        <p className="mb-2 text-xs text-muted-foreground">{product.manufacturer}</p>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{product.views}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
