'use client';

import { products, categories as baseCategories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useState, useEffect } from 'react';

export default function SponsorDashboardPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [categories, setCategories] = useState(baseCategories);

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Sponsor Artisans',
    description: 'Discover and support talented creators.',
    sponsorButton: 'Sponsor Artisan',
    toastTitle: 'Sponsorship Sent!',
    toastDescription: 'Your request to sponsor {artisanName} for their "{productName}" has been sent.',
    by: 'by',
    specializesIn: 'specializes in',
    supportCraft: 'Support their craft to see more creations like this.'
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const categoryNames = baseCategories.map(c => c.name);
        const textsToTranslate = [
          'Sponsor Artisans',
          'Discover and support talented creators.',
          'Sponsor Artisan',
          'Sponsorship Sent!',
          'Your request to sponsor {artisanName} for their "{productName}" has been sent.',
          'by',
          'specializes in',
          'Support their craft to see more creations like this.',
          ...categoryNames
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        setTranslatedContent({
          title: translatedTexts[0],
          description: translatedTexts[1],
          sponsorButton: translatedTexts[2],
          toastTitle: translatedTexts[3],
          toastDescription: translatedTexts[4],
          by: translatedTexts[5],
          specializesIn: translatedTexts[6],
          supportCraft: translatedTexts[7],
        });

        const translatedCategories = baseCategories.map((cat, index) => ({
          ...cat,
          name: translatedTexts[8 + index],
        }));
        setCategories(translatedCategories);
      } else {
        setCategories(baseCategories);
        setTranslatedContent({
          title: 'Sponsor Artisans',
          description: 'Discover and support talented creators.',
          sponsorButton: 'Sponsor Artisan',
          toastTitle: 'Sponsorship Sent!',
          toastDescription: 'Your request to sponsor {artisanName} for their "{productName}" has been sent.',
          by: 'by',
          specializesIn: 'specializes in',
          supportCraft: 'Support their craft to see more creations like this.'
        });
      }
    };
    translateContent();
  }, [language]);

  const handleSponsor = (product: Product) => {
    const description = translatedContent.toastDescription
        .replace('{artisanName}', product.artisan.name)
        .replace('{productName}', product.name);

    toast({
      title: translatedContent.toastTitle,
      description: description,
    });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold">{translatedContent.title}</h1>
        <p className="text-md text-muted-foreground">{translatedContent.description}</p>
      </header>

      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="font-headline text-xl font-semibold mb-4">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.filter(p => p.category === category.name || baseCategories.find(bc => bc.id === category.id)?.name === p.category).map(product => (
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
                        <h3 className="font-bold text-md text-white font-headline">{product.name}</h3>
                        <p className="text-sm text-white/90">{translatedContent.by} {product.artisan.name}</p>
                       </div>
                    </div>
                  </CardContent>
                  <CardContent className="p-3">
                     <p className="text-sm text-muted-foreground mb-3 h-10 overflow-hidden">
                        {product.artisan.name} {translatedContent.specializesIn} {product.category}. {translatedContent.supportCraft}
                     </p>
                    <Button className="w-full" onClick={() => handleSponsor(product)}>{translatedContent.sponsorButton}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
