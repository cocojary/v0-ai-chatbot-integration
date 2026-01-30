import React from "react"
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/lib/types";
import { Gauge, Cog, Bot, Zap, Wind, FlaskRound } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gauge: Gauge,
  cog: Cog,
  robot: Bot,
  zap: Zap,
  wind: Wind,
  flask: FlaskRound,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Gauge;

  return (
    <Link href={`/categories/${category.id}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-1 font-semibold text-foreground">{category.nameJa}</h3>
          <p className="mb-2 text-xs text-muted-foreground">{category.name}</p>
          <p className="text-sm font-medium text-primary">
            {category.productCount}件
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
