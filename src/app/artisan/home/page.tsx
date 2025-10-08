
'use client';

import { useState, useEffect, useRef } from 'react';
import { getCommunityTrendInsights } from '@/ai/flows/community-trend-insights';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { products as allProducts, categories as baseCategories } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Lightbulb, Play, Pause, RotateCcw, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SavedCollection, Product } from '@/lib/types';
import { useTranslation } from '@/context/translation-context';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mocking the current artisan as Elena Vance (ID '1')
const CURRENT_ARTISAN_ID = '1';

interface AiReviewResult {
    aiReview: string;
    aiReviewAudio: string;
}

const formSchema = z.object({
  productDescription: z.string().min(10, 'Description must be at least 10 characters long.'),
});

export default function ArtisanHomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiReviewResult | null>(null);
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.artisan_home;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // My Products
  const myProducts = allProducts.filter(p => p.artisan.id === CURRENT_ARTISAN_ID);
  const myMostLiked = [...myProducts].sort((a, b) => b.likes - a.likes);
  const myMostBought = [...myProducts].sort((a, b) => b.sales - a.sales);

  // Other Artisans' Products
  const otherProducts = allProducts.filter(p => p.artisan.id !== CURRENT_ARTISAN_ID);
  const otherMostLiked = [...otherProducts].sort((a, b) => b.likes - a.likes);
  const otherMostBought = [...otherProducts].sort((a, b) => b.sales - a.sales);
  
  const filteredOtherMostBought = selectedCategory
    ? otherMostBought.filter(p => p.category === selectedCategory)
    : otherMostBought;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { productDescription: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getCommunityTrendInsights({
        artisanId: CURRENT_ARTISAN_ID,
        productDescription: values.productDescription,
      });
      setResult(response);
      toast({
        title: t.insightsGeneratedToast,
        description: t.insightsGeneratedToastDesc,
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        variant: 'destructive',
        title: t.insightGenerationFailedToast,
        description: t.insightGenerationFailedToastDesc,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSaveToCollection(product: Product) {
    if (!product) return;

    const collections: SavedCollection[] = JSON.parse(localStorage.getItem('artisanCollections') || '[]');
    const categoryName = product.category;
    let collection = collections.find(c => c.name === categoryName);

    if (collection) {
      if (!collection.productIds.includes(product.id)) {
        collection.productIds.push(product.id);
      }
    } else {
      collection = {
        id: `coll-${Date.now()}-${Math.random()}`,
        name: categoryName,
        productIds: [product.id],
      };
      collections.push(collection);
    }

    localStorage.setItem('artisanCollections', JSON.stringify(collections));

    toast({
      title: t.savedToCollectionToast.replace('{collectionName}', categoryName),
    });
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted/40">
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">{t.pageTitle}</h2>
            <p className="text-muted-foreground">{t.pageDescription}</p>
          </div>
        </div>

        {/* My Top Performers */}
        <section>
          <h3 className="font-headline text-xl font-semibold mb-4">Your Top Performers</h3>
          <div className="space-y-6">
            <div className="w-full overflow-hidden">
              <h4 className="font-semibold text-md mb-2">Most Liked</h4>
               <Carousel opts={{ align: 'start' }}>
                <CarouselContent>
                  {myMostLiked.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2">
                       <ProductCard product={product} onSave={() => handleSaveToCollection(product)} showSaveButton className="aspect-[3/4]" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
             <div className="w-full overflow-hidden">
              <h4 className="font-semibold text-md mb-2">Most Bought</h4>
               <Carousel opts={{ align: 'start' }}>
                <CarouselContent>
                  {myMostBought.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2">
                       <ProductCard product={product} onSave={() => handleSaveToCollection(product)} showSaveButton className="aspect-[3/4]" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        {/* AI Review & Community Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t.aiReviewTitle}</CardTitle>
                <CardDescription className="text-xs">{t.aiReviewDescription}</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="productDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">{t.productDescriptionLabel}</FormLabel>
                          <FormControl>
                            <Textarea placeholder={t.productDescriptionPlaceholder} {...field} className="h-24 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading} size="sm" className="w-full">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                      {isLoading ? t.analyzingButton : t.getReviewButton}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            {result && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-md">{t.aiGeneratedInsightsTitle}</CardTitle>
                         {result.aiReviewAudio && (
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handlePlayPause}>
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleRestart}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <audio ref={audioRef} src={result.aiReviewAudio} onEnded={handleAudioEnded} />
                          </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 w-full rounded-md border p-3">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{result.aiReview}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {!result && !isLoading && (
                 <div className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-4 text-center text-muted-foreground mt-6">
                    <Sparkles className="h-8 w-8" />
                    <p className="mt-2 text-xs">{t.aiPlaceholder}</p>
                </div>
            )}

          </div>

          <div className="lg:col-span-2">
             {/* Most Liked of Other Artisans */}
            <section className="mb-6">
                <h3 className="font-headline text-xl font-semibold mb-4">Community Favorites: Most Liked</h3>
                <div className="w-full overflow-hidden">
                    <Carousel opts={{ align: 'start' }}>
                    <CarouselContent>
                        {otherMostLiked.slice(0, 8).map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 pr-2">
                            <ProductCard product={product} onSave={() => handleSaveToCollection(product)} showSaveButton className="aspect-[3/4]" />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    </Carousel>
                </div>
            </section>

             {/* Most Bought of Other Artisans */}
            <section>
                <h3 className="font-headline text-xl font-semibold mb-4">Top Sellers: Most Bought</h3>
                <div className="mb-4">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex items-center gap-2 pb-2">
                       <Button variant={!selectedCategory ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(null)}>All</Button>
                      {baseCategories.map(cat => (
                        <Button key={cat.id} variant={selectedCategory === cat.name ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(cat.name)}>{translations.product_categories[baseCategories.findIndex(c=>c.id === cat.id)] || cat.name}</Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredOtherMostBought.slice(0, 6).map((product) => (
                    <ProductCard key={product.id} product={product} onSave={() => handleSaveToCollection(product)} showSaveButton className="aspect-[3/4]" />
                  ))}
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

    