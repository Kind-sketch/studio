
'use client';

import { products, categories as baseCategories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { Product, Artisan, Category } from "@/lib/types";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useTranslation } from "@/context/translation-context";

export default function SponsorDashboardPage() {
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.sponsor_dashboard_page;

  const categories = baseCategories.map((category, index) => ({
    ...category,
    name: translations.product_categories[index] || category.name,
  }));

  const productsByCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName);
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <header className="mb-6 text-center">
        <h1 className="font-headline text-3xl font-bold">{t.title}</h1>
        <p className="text-md text-muted-foreground max-w-lg mx-auto">{t.description}</p>
      </header>

      <section className="my-10">
        <h2 className="font-headline text-2xl font-semibold mb-6 text-center">{t.discoverTitle}</h2>
        <div className="space-y-8">
          {categories.map((category) => {
            const originalCategory = baseCategories.find(c => c.id === category.id);
            if (!originalCategory) return null;

            const categoryProducts = productsByCategory(originalCategory.name);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id}>
                <h3 className="font-headline text-xl font-semibold mb-4">{category.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <Image
                            src={product.image.url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                          <div className="absolute bottom-0 left-0 p-3">
                            <h4 className="font-bold text-md text-white font-headline">{product.name}</h4>
                            <p className="text-sm text-white/90">{t.by} {product.artisan.name}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardContent className="p-3">
                        <p className="text-sm text-muted-foreground mb-3 h-10 overflow-hidden">
                          {product.artisan.name} {t.specializesIn} {category.name}. {t.supportCraft}
                        </p>
                        <Link href={`/sponsor/product/${product.id}`} passHref>
                          <Button className="w-full">{t.viewArtisanButton}</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
