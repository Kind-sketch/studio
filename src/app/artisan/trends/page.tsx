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
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
});

export default function TrendsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    trendingCrafts: string[];
    aiReview: string;
  } | null>(null);
  const { toast } = useToast();

  const bestSelling = [...products].sort((a, b) => b.sales - a.sales);
  const frequentlyBought = [...products].sort((a, b) => b.likes - a.likes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getCommunityTrendInsights({
        artisanId: 'artisan-123', // Mock artisan ID
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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Community & Trend Insights</h1>
        <p className="text-muted-foreground">Discover what's popular and get AI-powered feedback.</p>
      </header>
      
      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-4">Best-Selling Crafts</h2>
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
        >
          <CarouselContent>
            {bestSelling.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-4">Frequently Viewed</h2>
        <Carousel
          opts={{ align: 'start', loop: true, direction: 'rtl' }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, playOnInit: true })]}
        >
          <CarouselContent>
            {frequentlyBought.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                 <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section>
        <div className="grid gap-8 lg:grid-cols-2">
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
                        <div>
                            <h3 className="font-headline text-lg font-semibold mb-2">Trending Crafts This Week</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.trendingCrafts.map((craft, i) => <Badge key={i} variant="secondary">{craft}</Badge>)}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col min-h-0">
                            <h3 className="font-headline text-lg font-semibold mb-2">AI Review & Analysis</h3>
                            <ScrollArea className="flex-1 h-0">
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
