
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import StatsChart from '@/components/stats-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { statsData, products } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getCommunityTrendInsights } from '@/ai/flows/community-trend-insights';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2, Sparkles, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Product } from '@/lib/types';


const chartConfig = {
  likes: {
    label: 'Likes',
    color: 'hsl(var(--chart-1))',
  },
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type Period = 'weekly' | 'monthly' | 'yearly';

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>('monthly');
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [reviewResult, setReviewResult] = useState<{productName: string, aiReview: string} | null>(null);
  const { toast } = useToast();

  const onPeriodChange = (value: string) => {
    setPeriod(value as Period);
  };
  
  const activeData = statsData[period];
  const dataKey = period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year';

  const handleAiReview = async (product: Product) => {
    setIsLoadingReview(true);
    setReviewResult(null);
    try {
        const response = await getCommunityTrendInsights({
            artisanId: 'artisan-123',
            productDescription: `Product Name: ${product.name}, Category: ${product.category}. This product is made by ${product.artisan.name}.`,
        });
        setReviewResult({productName: product.name, ...response});
    } catch (error) {
        console.error('Error generating review:', error);
        toast({
            variant: 'destructive',
            title: 'Review Failed',
            description: 'There was an error generating the AI review.',
        });
    } finally {
        setIsLoadingReview(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold">Your Performance</h1>
        <p className="text-sm text-muted-foreground">Analyze your sales and engagement over time.</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Likes vs. Sales</CardTitle>
              <CardDescription>
                Showing data for {period.charAt(0).toUpperCase() + period.slice(1)} performance.
              </CardDescription>
            </div>
            <Tabs defaultValue={period} onValueChange={onPeriodChange} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto text-xs">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="w-[800px] h-[400px] pr-4">
              <StatsChart data={activeData} config={chartConfig} dataKey={dataKey}/>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Review metrics and get AI insights for each product.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {products.map(product => (
                <div key={product.id} className="flex items-center gap-2 sm:gap-4 p-2 rounded-lg border">
                     <Image src={product.image.url} alt={product.name} width={64} height={64} className="rounded-md object-cover aspect-square bg-muted"/>
                     <div className="flex-1 text-sm">
                       <p className="font-medium truncate">{product.name}</p>
                       <p className="text-muted-foreground">₹{product.price.toFixed(2)}</p>
                     </div>
                     <div className="text-right text-xs sm:text-sm space-y-1">
                        <p className="font-medium">{product.sales} sales</p>
                        <p className="text-muted-foreground flex items-center justify-end gap-1"><Heart className="h-3 w-3"/>{product.likes}</p>
                     </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleAiReview(product)}>
                                <Lightbulb className="mr-0 sm:mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">AI Review</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-2xl">
                            {isLoadingReview ? (
                                <div className="flex h-64 items-center justify-center">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Generating AI Review</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Please wait while the AI analyzes the product...
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                </div>
                            ) : reviewResult ? (
                                <>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>AI Review for: <span className="text-primary">{reviewResult.productName}</span></AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Here's the AI analysis of your product's potential.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <ScrollArea className="h-96 pr-6">
                                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap pr-4">{reviewResult.aiReview}</div>
                                </ScrollArea>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Close</AlertDialogCancel>
                                </AlertDialogFooter>
                                </>
                            ) : (
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Get AI Insights</AlertDialogTitle>
                                    <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                                        <Sparkles className="h-12 w-12" />
                                        <p className="mt-4">Click "AI Review" to generate an analysis.</p>
                                    </div>
                                </AlertDialogHeader>
                            )}
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
