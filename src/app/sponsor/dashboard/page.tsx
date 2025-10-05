
'use client';

import { products, categories as baseCategories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { Product, Artisan } from "@/lib/types";
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductCard from "@/components/product-card";
import Link from "next/link";

export default function SponsorDashboardPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [categories, setCategories] = useState(baseCategories);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Welcome, Sponsor!',
    description: "Invest in culture, empower creators, and share in the success of India's finest artisans.",
    discoverTitle: 'Discover Artisans to Sponsor',
    viewArtisanButton: 'View Artisan',
    by: 'by',
    specializesIn: 'specializes in',
    supportCraft: 'Support their craft to see more creations like this.',
    sponsorButton: 'Sponsor Artisan',
    toastTitle: 'Sponsorship Sent!',
    toastDescription: 'Your request to sponsor {artisanName} has been sent.',
    artisanDetailsTitle: 'Artisan Details',
    otherProducts: "Other products by this artisan"
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const categoryNames = baseCategories.map(c => c.name);
        const textsToTranslate = [
            ...Object.values(translatedContent),
            ...categoryNames
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        
        const newContent: any = {};
        Object.keys(translatedContent).forEach((key, index) => {
          newContent[key] = translatedTexts[index];
        });
        setTranslatedContent(newContent);
        
        const translatedCategories = baseCategories.map((cat, index) => ({
          ...cat,
          name: translatedTexts[Object.keys(translatedContent).length + index]
        }));
        setCategories(translatedCategories);

      } else {
        setCategories(baseCategories);
      }
    };
    translateContent();
  }, [language]);

  const handleSponsor = (artisanName: string) => {
    const description = translatedContent.toastDescription.replace('{artisanName}', artisanName);
    toast({
      title: translatedContent.toastTitle,
      description: description,
    });
  }

  const allProductsByArtisan = (artisanId: string) => {
    return products.filter(p => p.artisan.id === artisanId);
  }
  
  const productsByCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName);
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <header className="mb-6 text-center">
        <h1 className="font-headline text-3xl font-bold">{translatedContent.title}</h1>
        <p className="text-md text-muted-foreground max-w-lg mx-auto">{translatedContent.description}</p>
      </header>

      <section className="my-10">
        <h2 className="font-headline text-2xl font-semibold mb-6 text-center">{translatedContent.discoverTitle}</h2>
        <div className="space-y-8">
          {baseCategories.map((category, index) => {
            const categoryProducts = productsByCategory(category.name);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id}>
                <h3 className="font-headline text-xl font-semibold mb-4">{categories[index]?.name || category.name}</h3>
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
                            <p className="text-sm text-white/90">{translatedContent.by} {product.artisan.name}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardContent className="p-3">
                        <p className="text-sm text-muted-foreground mb-3 h-10 overflow-hidden">
                          {product.artisan.name} {translatedContent.specializesIn} {product.category}. {translatedContent.supportCraft}
                        </p>
                        <Link href={`/sponsor/product/${product.id}`} passHref>
                          <Button className="w-full">{translatedContent.viewArtisanButton}</Button>
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
