
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getCommunityTrendInsights } from '@/ai/flows/community-trend-insights';

import { products } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SavedCollection, Product } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

const formSchema = z.object({
  productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
});


export default function TrendsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ aiReview: string; } | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
      title: "Community & Trend Insights",
      description: "Discover what's popular and get AI-powered feedback.",
      bestSelling: "Best-Selling Crafts",
      frequentlyViewed: "Frequently Viewed",
      aiReviewTitle: "AI Product Review",
      aiReviewDescription: "Get targeted audience insights and revenue metrics for your product idea.",
      productDescriptionLabel: "Product Description or Idea",
      productDescriptionPlaceholder: "Describe a product you're selling or thinking of creating...",
      getReviewButton: "Get AI Review",
      analyzingButton: "Analyzing...",
      insightsGeneratedToast: "Insights Generated!",
      insightsGeneratedToastDesc: "Your AI product review is ready.",
      insightGenerationFailedToast: "Insight Generation Failed",
      insightGenerationFailedToastDesc: "There was an error. Please try again.",
      aiGeneratedInsightsTitle: "AI-Generated Insights",
      aiGeneratedInsightsDescription: "Here's what our AI thinks.",
      aiReviewAnalysisTitle: "AI Review & Analysis",
      aiPlaceholder: "Your AI review and trend analysis will appear here.",
      savedToCollectionToast: "Saved to {collectionName}",
  });

  const bestSelling = [...products].sort((a, b) => b.sales - a.sales);
  const frequentlyBought = [...products].sort((a, b) => b.likes - a.likes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productDescription: '' },
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = Object.values(translatedContent);
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });

        const newContent: any = {};
        Object.keys(translatedContent).forEach((key, index) => {
          newContent[key] = translatedTexts[index];
        });
        setTranslatedContent(newContent);
      }
    };
    translateContent();
  }, [language]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getCommunityTrendInsights({
        artisanId: 'artisan-123',
        productDescription: values.productDescription,
      });
      setResult(response);
      toast({
        title: translatedContent.insightsGeneratedToast,
        description: translatedContent.insightsGeneratedToastDesc,
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        variant: 'destructive',
        title: translatedContent.insightGenerationFailedToast,
        description: translatedContent.insightGenerationFailedToastDesc,
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
      title: translatedContent.savedToCollectionToast.replace('{collectionName}', categoryName),
    });
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </header>
      
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-4">{translatedContent.bestSelling}</h2>
        <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {bestSelling.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2">
                <ProductCard product={product} onSave={() => handleSaveToCollection(product)} showSaveButton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-4">{translatedContent.frequentlyViewed}</h2>
        <Carousel opts={{ align: 'start', loop: true, direction: 'rtl' }} plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {frequentlyBought.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2">
                <ProductCard product={product} onSave={() => handleSaveToCollection(product)} showSaveButton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    
      <section>
        <div className="grid gap-8 lg:grid-cols-1">
            <Card>
                <CardHeader>
                    <CardTitle>{translatedContent.aiReviewTitle}</CardTitle>
                    <CardDescription>{translatedContent.aiReviewDescription}</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <FormField control={form.control} name="productDescription" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{translatedContent.productDescriptionLabel}</FormLabel>
                            <FormControl><Textarea placeholder={translatedContent.productDescriptionPlaceholder} {...field} className="h-32" /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {translatedContent.analyzingButton}</> : <><Lightbulb className="mr-2 h-4 w-4" /> {translatedContent.getReviewButton}</>}
                        </Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>{translatedContent.aiGeneratedInsightsTitle}</CardTitle>
                    <CardDescription>{translatedContent.aiGeneratedInsightsDescription}</CardDescription>
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
                        <p className="mt-4">{translatedContent.aiPlaceholder}</p>
                    </div>
                    )}
                    {result && (
                    <div className="space-y-6 flex-1 flex flex-col min-h-0">
                        <div className="flex-1 flex flex-col min-h-0">
                            <h3 className="font-headline text-lg font-semibold mb-2">{translatedContent.aiReviewAnalysisTitle}</h3>
                            <ScrollArea className="flex-1 h-96">
                                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap pr-4">{result.aiReview}</div>
                            </ScrollArea>
                        </div>
                    </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
