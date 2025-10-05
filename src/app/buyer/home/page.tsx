'use client';

import { products, categories as baseCategories } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useState, useEffect } from 'react';

export default function BuyerHomePage() {
  const trendingProducts = [...products].sort((a, b) => b.likes - a.likes);
  const { language } = useLanguage();
  const [categories, setCategories] = useState(baseCategories);
  const [translatedContent, setTranslatedContent] = useState({
    title: 'Discover Handcrafted Wonders',
    description: 'Explore unique creations from artisans around the world.',
    categoriesTitle: 'Categories',
    trendingTitle: 'Trending Now',
    allProductsTitle: 'All Products',
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const categoryNames = baseCategories.map(c => c.name);
        const textsToTranslate = [
          'Discover Handcrafted Wonders',
          'Explore unique creations from artisans around the world.',
          'Categories',
          'Trending Now',
          'All Products',
          ...categoryNames,
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        setTranslatedContent({
          title: translatedTexts[0],
          description: translatedTexts[1],
          categoriesTitle: translatedTexts[2],
          trendingTitle: translatedTexts[3],
          allProductsTitle: translatedTexts[4],
        });
        const translatedCategories = baseCategories.map((cat, index) => ({
          ...cat,
          name: translatedTexts[5 + index],
        }));
        setCategories(translatedCategories);
      } else {
        setCategories(baseCategories);
        setTranslatedContent({
          title: 'Discover Handcrafted Wonders',
          description: 'Explore unique creations from artisans around the world.',
          categoriesTitle: 'Categories',
          trendingTitle: 'Trending Now',
          allProductsTitle: 'All Products',
        });
      }
    };
    translateContent();
  }, [language]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center px-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {translatedContent.title}
        </h1>
        <p className="mt-2 text-md text-muted-foreground">
          {translatedContent.description}
        </p>
      </header>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="mb-4 font-headline text-2xl font-semibold">
          {translatedContent.categoriesTitle}
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer overflow-hidden text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="flex flex-col items-center justify-center p-3 md:p-6">
                <category.icon className="mb-2 h-6 w-6 md:h-8 md:w-8 text-primary transition-colors group-hover:text-accent-foreground" />
                <span className="font-semibold text-xs md:text-sm text-foreground group-hover:text-accent-foreground text-center">{category.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="mb-12">
        <h2 className="mb-4 font-headline text-2xl font-semibold">
          {translatedContent.trendingTitle}
        </h2>
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
        >
          <CarouselContent>
            {trendingProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Main Product Feed */}
      <section>
        <h2 className="mb-4 font-headline text-2xl font-semibold">
          {translatedContent.allProductsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}