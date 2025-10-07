
'use client';

import { useState, useEffect, useRef } from 'react';
import { getCommunityTrendInsights } from '@/ai/flows/community-trend-insights';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { products as allProducts } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Lightbulb, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SavedCollection, Product } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';
import { useTranslation } from '@/context/translation-context';

// Mocking the current artisan as Elena Vance (ID '1')
const CURRENT_ARTISAN_ID = '1';

interface AiReviewResult {
    aiReview: string;
    aiReviewAudio: string;
}

export default function ArtisanHomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiReviewResult | null>(null);

  const { toast } = useToast();
  const { language } = useLanguage();
  const { translations } = useTranslation();
  const t = translations.artisan_home;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);


  const myProducts = allProducts.filter(p => p.artisan.id === CURRENT_ARTISAN_ID);

  const form = useForm({
    resolver: zodResolver(z.object({
      productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
    })),
    defaultValues: { productDescription: '' },
  });

  async function onSubmit(values: { productDescription: string }) {
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
      // Add product to existing collection if not already there
      if (!collection.productIds.includes(product.id)) {
        collection.productIds.push(product.id);
      }
    } else {
      // Create new collection for the category
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
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageDescription}</p>
      </header>
      
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-4">{t.myProductsTitle}</h2>
        {myProducts.length > 0 ? (
          <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
              <CarouselContent>
              {myProducts.map((product) => (
                  <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/3">
                    <ProductCard product={product} onSave={() => handleSaveToCollection(product)} showSaveButton />
                  </CarouselItem>
              ))}
              </CarouselContent>
          </Carousel>
          ) : (
            <Card className="flex items-center justify-center p-12">
              <div className="text-center text-muted-foreground">
                  <p className="text-lg">You haven't added any products yet.</p>
              </div>
          </Card>
          )}
      </section>
    
      <section>
        <div className="grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t.aiReviewTitle}</CardTitle>
                    <CardDescription>{t.aiReviewDescription}</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <FormField control={form.control} name="productDescription" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.productDescriptionLabel}</FormLabel>
                            <FormControl><Textarea placeholder={t.productDescriptionPlaceholder} {...field} className="h-32" /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.analyzingButton}</> : <><Lightbulb className="mr-2 h-4 w-4" /> {t.getReviewButton}</>}
                        </Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>{t.aiGeneratedInsightsTitle}</CardTitle>
                    <CardDescription>{t.aiGeneratedInsightsDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 flex flex-col">
                    {isLoading && (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                    )}
                    {!isLoading && !result && (
                    <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary/50 p-8 text-center text-muted-foreground">
                        <Sparkles className="h-12 w-12" />
                        <p className="mt-4">{t.aiPlaceholder}</p>
                    </div>
                    )}
                    {result && (
                    <div className="space-y-4 flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-headline text-lg font-semibold">{t.aiReviewAnalysisTitle}</h3>
                            {result.aiReviewAudio && (
                                <div className="flex items-center gap-2">
                                    <Button size="icon" onClick={handlePlayPause}>
                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                    <Button size="icon" variant="outline" onClick={handleRestart}>
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                    <audio ref={audioRef} src={result.aiReviewAudio} onEnded={handleAudioEnded} />
                                </div>
                            )}
                        </div>
                        <ScrollArea className="flex-1 h-80">
                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap pr-4">{result.aiReview}</div>
                        </ScrollArea>
                    </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
