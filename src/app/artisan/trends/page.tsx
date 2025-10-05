
'use client';

import { useState } from 'react';
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


const formSchema = z.object({
  productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
});

const collectionSchema = z.object({
  collectionName: z.string().min(2, 'Collection name must be at least 2 characters.'),
});

export default function TrendsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ aiReview: string; } | null>(null);
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { toast } = useToast();

  const bestSelling = [...products].sort((a, b) => b.sales - a.sales);
  const frequentlyBought = [...products].sort((a, b) => b.likes - a.likes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productDescription: '' },
  });

  const collectionForm = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: { collectionName: '' },
  });

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
        title: 'Insights Generated!',
        description: 'Your AI product review is ready.',
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        variant: 'destructive',
        title: 'Insight Generation Failed',
        description: 'There was an error. Please try again.',
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
        title: `Saved to ${collections.find(c => c.id === collectionId)?.name}`,
    });
    setSelectedProduct(null);
  }

  function onCreateCollection(values: z.infer<typeof collectionSchema>) {
    const newCollection: SavedCollection = {
        id: `coll-${Date.now()}`,
        name: values.collectionName,
        productIds: selectedProduct ? [selectedProduct.id] : [],
    };
    setCollections(prev => [...prev, newCollection]);
    toast({
        title: "Collection Created",
        description: `Successfully created and saved to "${values.collectionName}".`
    });
    collectionForm.reset();
    setSelectedProduct(null);
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Community & Trend Insights</h1>
        <p className="text-muted-foreground">Discover what's popular and get AI-powered feedback.</p>
      </header>
      
      <AlertDialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <section className="mb-12">
          <h2 className="font-headline text-2xl font-semibold mb-4">Best-Selling Crafts</h2>
          <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
              {bestSelling.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2">
                   <AlertDialogTrigger asChild>
                    <ProductCard product={product} onSave={() => setSelectedProduct(product)} showSaveButton />
                  </AlertDialogTrigger>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section className="mb-12">
          <h2 className="font-headline text-2xl font-semibold mb-4">Frequently Viewed</h2>
          <Carousel opts={{ align: 'start', loop: true, direction: 'rtl' }} plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
              {frequentlyBought.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2">
                  <AlertDialogTrigger asChild>
                    <ProductCard product={product} onSave={() => setSelectedProduct(product)} showSaveButton />
                  </AlertDialogTrigger>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      
        <section>
          <div className="grid gap-8 lg:grid-cols-1">
              <Card>
                  <CardHeader>
                      <CardTitle>AI Product Review</CardTitle>
                      <CardDescription>Get targeted audience insights and revenue metrics for your product idea.</CardDescription>
                  </CardHeader>
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                      <CardContent>
                          <FormField control={form.control} name="productDescription" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Product Description or Idea</FormLabel>
                              <FormControl><Textarea placeholder="Describe a product you're selling or thinking of creating..." {...field} className="h-32" /></FormControl>
                              <FormMessage />
                          </FormItem>
                          )} />
                      </CardContent>
                      <CardFooter>
                          <Button type="submit" disabled={isLoading} className="w-full">
                          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Lightbulb className="mr-2 h-4 w-4" /> Get AI Review</>}
                          </Button>
                      </CardFooter>
                      </form>
                  </Form>
              </Card>

              <Card className="flex flex-col">
                  <CardHeader>
                      <CardTitle>AI-Generated Insights</CardTitle>
                      <CardDescription>Here's what our AI thinks.</CardDescription>
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
                          <p className="mt-4">Your AI review and trend analysis will appear here.</p>
                      </div>
                      )}
                      {result && (
                      <div className="space-y-6 flex-1 flex flex-col min-h-0">
                          <div className="flex-1 flex flex-col min-h-0">
                              <h3 className="font-headline text-lg font-semibold mb-2">AI Review & Analysis</h3>
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
                <AlertDialogTitle>Save to Collection</AlertDialogTitle>
                <AlertDialogDescription>
                    Save "{selectedProduct?.name}" to an existing collection or create a new one.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
                {collections.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Existing Collections</h4>
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
                        <h4 className="font-medium text-sm">Create New Collection</h4>
                          <FormField
                            control={collectionForm.control}
                            name="collectionName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="e.g., 'Inspiration', 'Next Project'" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Create and Save</Button>
                    </form>
                </Form>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
