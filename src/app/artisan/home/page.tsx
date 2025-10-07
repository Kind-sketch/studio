
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
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SavedCollection, Product } from '@/lib/types';
import { useTranslation } from '@/context/translation-context';

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

  const myProducts = allProducts.filter(p => p.artisan.id === CURRENT_ARTISAN_ID);

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
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">{t.pageTitle}</h2>
            <p className="text-muted-foreground">{t.pageDescription}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.myProductsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {myProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {myProducts.slice(0, 6).map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onSave={() => handleSaveToCollection(product)} 
                      showSaveButton 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-md border-2 border-dashed text-center">
                  <p className="text-lg font-medium">You haven't added any products yet.</p>
                  <Button variant="link" asChild>
                    <a href="/artisan/add-product">Add your first product</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.aiReviewTitle}</CardTitle>
              <CardDescription>{t.aiReviewDescription}</CardDescription>
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
                          <Textarea
                            placeholder={t.productDescriptionPlaceholder}
                            {...field}
                            className="h-28"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.analyzingButton}</>
                    ) : (
                      <><Lightbulb className="mr-2 h-4 w-4" /> {t.getReviewButton}</>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>{t.aiGeneratedInsightsTitle}</CardTitle>
              <CardDescription>{t.aiGeneratedInsightsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <ScrollArea className="h-48 w-full rounded-md border p-4">
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {result.aiReview}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
        
        {!result && !isLoading && (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12" />
                <p className="mt-4">{t.aiPlaceholder}</p>
            </div>
        )}

        {isLoading && !result && (
            <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

      </div>
    </div>
  );
}

    