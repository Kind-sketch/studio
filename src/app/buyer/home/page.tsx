
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
    <div className="container mx-auto px-2 sm:px-4 py-6">
      <header className="mb-6 text-center px-4">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
          {translatedContent.title}
        </h1>
        <p className="mt-1 text-sm sm:text-md text-muted-foreground">
          {translatedContent.description}
        </p>
      </header>

      {/* Categories Section */}
      <section className="mb-8">
        <h2 className="mb-4 font-headline text-lg sm:text-xl font-semibold">
          {translatedContent.categoriesTitle}
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer overflow-hidden text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4">
                <category.icon className="mb-1 h-5 w-5 sm:h-6 sm:w-6 text-primary transition-colors group-hover:text-accent-foreground" />
                <span className="font-semibold text-[10px] sm:text-xs text-foreground group-hover:text-accent-foreground text-center">{category.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="mb-10">
        <h2 className="mb-4 font-headline text-lg sm:text-xl font-semibold">
          {translatedContent.trendingTitle}
        </h2>
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
          className="-mx-2"
        >
          <CarouselContent className="ml-2">
            {trendingProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-full pl-2">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Main Product Feed */}
      <section>
        <h2 className="mb-4 font-headline text-lg sm:text-xl font-semibold">
          {translatedContent.allProductsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
