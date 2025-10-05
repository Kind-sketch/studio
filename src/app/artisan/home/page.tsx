'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import type { SavedCollection, Product } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

// Mocking the current artisan as Elena Vance (ID '1')
const CURRENT_ARTISAN_ID = '1';

export default function ArtisanHomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ aiReview: string; } | null>(null);
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [translatedContent, setTranslatedContent] = useState({
    pageTitle: "Your Creative Space",
    pageDescription: "Manage your products and get AI-powered feedback.",
    myProductsTitle: "Your Products",
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
    saveToCollectionTitle: "Save to Collection",
    saveToCollectionDescription: 'Save "{productName}" to an existing collection or create a new one.',
    existingCollections: "Existing Collections",
    createNewCollection: "Create New Collection",
    collectionNamePlaceholder: "e.g., 'Inspiration', 'Next Project'",
    createAndSaveButton: "Create and Save",
    savedToCollectionToast: "Saved to {collectionName}",
    collectionCreatedToast: "Collection Created",
    collectionCreatedToastDesc: 'Successfully created and saved to "{collectionName}".',
    cancelButton: "Cancel"
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = Object.values(translatedContent);
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });

        setTranslatedContent({
            pageTitle: translatedTexts[0],
            pageDescription: translatedTexts[1],
            myProductsTitle: translatedTexts[2],
            aiReviewTitle: translatedTexts[3],
            aiReviewDescription: translatedTexts[4],
            productDescriptionLabel: translatedTexts[5],
            productDescriptionPlaceholder: translatedTexts[6],
            getReviewButton: translatedTexts[7],
            analyzingButton: translatedTexts[8],
            insightsGeneratedToast: translatedTexts[9],
            insightsGeneratedToastDesc: translatedTexts[10],
            insightGenerationFailedToast: translatedTexts[11],
            insightGenerationFailedToastDesc: translatedTexts[12],
            aiGeneratedInsightsTitle: translatedTexts[13],
            aiGeneratedInsightsDescription: translatedTexts[14],
            aiReviewAnalysisTitle: translatedTexts[15],
            aiPlaceholder: translatedTexts[16],
            saveToCollectionTitle: translatedTexts[17],
            saveToCollectionDescription: translatedTexts[18],
            existingCollections: translatedTexts[19],
            createNewCollection: translatedTexts[20],
            collectionNamePlaceholder: translatedTexts[21],
            createAndSaveButton: translatedTexts[22],
            savedToCollectionToast: translatedTexts[23],
            collectionCreatedToast: translatedTexts[24],
            collectionCreatedToastDesc: translatedTexts[25],
            cancelButton: translatedTexts[26],
        });
      }
    };
    translateContent();
  }, [language]);


  const myProducts = allProducts.filter(p => p.artisan.id === CURRENT_ARTISAN_ID);

  const form = useForm({
    resolver: zodResolver(z.object({
      productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
    })),
    defaultValues: { productDescription: '' },
  });

  const collectionForm = useForm({
    resolver: zodResolver(z.object({
      collectionName: z.string().min(2, 'Collection name must be at least 2 characters.'),
    })),
    defaultValues: { collectionName: '' },
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

  function onSaveToCollection(collectionId: string) {
    if (!selectedProduct) return;

    setCollections(prev => prev.map(c => 
        c.id === collectionId ? { ...c, productIds: [...c.productIds, selectedProduct.id] } : c
    ));
    toast({
        title: translatedContent.savedToCollectionToast.replace('{collectionName}', collections.find(c => c.id === collectionId)?.name || ''),
    });
    setSelectedProduct(null);
  }

  function onCreateCollection(values: { collectionName: string }) {
    const newCollection: SavedCollection = {
        id: `coll-${Date.now()}`,
        name: values.collectionName,
        productIds: selectedProduct ? [selectedProduct.id] : [],
    };
    setCollections(prev => [...prev, newCollection]);
    toast({
        title: translatedContent.collectionCreatedToast,
        description: translatedContent.collectionCreatedToastDesc.replace('{collectionName}', values.collectionName),
    });
    collectionForm.reset();
    setSelectedProduct(null);
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{translatedContent.pageTitle}</h1>
        <p className="text-muted-foreground">{translatedContent.pageDescription}</p>
      </header>
      
      <AlertDialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <section className="mb-12">
          <h2 className="font-headline text-2xl font-semibold mb-4">{translatedContent.myProductsTitle}</h2>
          {myProducts.length > 0 ? (
            <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
                <CarouselContent>
                {myProducts.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <ProductCard product={product} />
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

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{translatedContent.saveToCollectionTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                    {translatedContent.saveToCollectionDescription.replace('{productName}', selectedProduct?.name || '')}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
                {collections.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{translatedContent.existingCollections}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {collections.map(c => (
                                <Button key={c.id} variant="outline" onClick={() => onSaveToCollection(c.id)}>
                                    {c.name}
                                </Button>
                            ))}
                        </div>
                      </div>
                )}
                <Form {...collectionForm}>
                    <form onSubmit={collectionForm.handleSubmit(onCreateCollection)} className="space-y-2">
                        <h4 className="font-medium text-sm">{translatedContent.createNewCollection}</h4>
                          <FormField
                            control={collectionForm.control}
                            name="collectionName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder={translatedContent.collectionNamePlaceholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">{translatedContent.createAndSaveButton}</Button>
                    </form>
                </Form>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>{translatedContent.cancelButton}</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
