
'use client';

import { useState, useEffect } from 'react';
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
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';


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
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Your Performance',
    description: "Analyze your sales and engagement over time.",
    likesVsSales: 'Likes vs. Sales',
    showingDataFor: 'Showing data for',
    performance: 'performance',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    productPerformance: 'Product Performance',
    productPerformanceDesc: 'Review metrics and get AI insights for each product.',
    productHeader: 'Product',
    reviewHeader: 'AI Review',
    generatingReviewTitle: 'Generating AI Review',
    generatingReviewDesc: 'Please wait while the AI analyzes the product...',
    reviewFor: 'AI Review for:',
    analysisOfPotential: "Here's the AI analysis of your product's potential.",
    close: 'Close',
    getInsightsTitle: 'Get AI Insights',
    getInsightsDesc: 'Click "AI Review" to generate an analysis.',
    reviewFailed: 'Review Failed',
    reviewFailedDesc: 'There was an error generating the AI review.',
  });

  useEffect(() => {
    const translate = async () => {
      if (language !== 'en') {
        const textsToTranslate = [
          'Your Performance',
          "Analyze your sales and engagement over time.",
          'Likes vs. Sales',
          'Showing data for',
          'performance',
          'Weekly',
          'Monthly',
          'Yearly',
          'Product Performance',
          'Review metrics and get AI insights for each product.',
          'Product',
          'AI Review',
          'Generating AI Review',
          'Please wait while the AI analyzes the product...',
          'AI Review for:',
          "Here's the AI analysis of your product's potential.",
          'Close',
          'Get AI Insights',
          'Click "AI Review" to generate an analysis.',
          'Review Failed',
          'There was an error generating the AI review.',
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        
        setTranslatedContent({
            title: translatedTexts[0],
            description: translatedTexts[1],
            likesVsSales: translatedTexts[2],
            showingDataFor: translatedTexts[3],
            performance: translatedTexts[4],
            weekly: translatedTexts[5],
            monthly: translatedTexts[6],
            yearly: translatedTexts[7],
            productPerformance: translatedTexts[8],
            productPerformanceDesc: translatedTexts[9],
            productHeader: translatedTexts[10],
            reviewHeader: translatedTexts[11],
            generatingReviewTitle: translatedTexts[12],
            generatingReviewDesc: translatedTexts[13],
            reviewFor: translatedTexts[14],
            analysisOfPotential: translatedTexts[15],
            close: translatedTexts[16],
            getInsightsTitle: translatedTexts[17],
            getInsightsDesc: translatedTexts[18],
            reviewFailed: translatedTexts[19],
            reviewFailedDesc: translatedTexts[20],
        });
      }
    };
    translate();
  }, [language]);


  const onPeriodChange = (value: string) => {
    setPeriod(value as Period);
  };
  
  const activeData = statsData[period];
  const dataKey = period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year';
  
  const getPeriodText = () => {
    if (language === 'en') {
        return period.charAt(0).toUpperCase() + period.slice(1);
    }
    return translatedContent[period] || period;
  }

  const handleAiReview = async (product: Product) => {
    setIsLoadingReview(true);
    setReviewResult(null);
    try {
        const {aiReview} = await getCommunityTrendInsights({
            artisanId: 'artisan-123',
            productDescription: `Product Name: ${product.name}, Category: ${product.category}. This product is made by ${product.artisan.name}.`,
        });
        setReviewResult({productName: product.name, aiReview});
    } catch (error) {
        console.error('Error generating review:', error);
        toast({
            variant: 'destructive',
            title: translatedContent.reviewFailed,
            description: translatedContent.reviewFailedDesc,
        });
    } finally {
        setIsLoadingReview(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="font-headline text-2xl font-bold">{translatedContent.title}</h1>
          <p className="text-sm text-muted-foreground">{translatedContent.description}</p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">{translatedContent.likesVsSales}</CardTitle>
                <CardDescription className="text-xs">
                  {translatedContent.showingDataFor} {getPeriodText()} {translatedContent.performance}.
                </CardDescription>
              </div>
              <Tabs defaultValue={period} onValueChange={onPeriodChange} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto text-xs h-8">
                  <TabsTrigger value="weekly" className="text-xs px-2">{translatedContent.weekly}</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs px-2">{translatedContent.monthly}</TabsTrigger>
                  <TabsTrigger value="yearly" className="text-xs px-2">{translatedContent.yearly}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="h-[250px] min-w-[500px]">
                <StatsChart data={activeData} config={chartConfig} dataKey={dataKey}/>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
              <CardTitle className="text-base">{translatedContent.productPerformance}</CardTitle>
              <CardDescription className="text-xs">{translatedContent.productPerformanceDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {products.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="flex items-center gap-2 p-2">
                    <Image src={product.image.url} alt={product.name} width={40} height={40} className="rounded-md object-cover aspect-square bg-muted"/>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                size="sm" 
                                onClick={() => handleAiReview(product)}
                                className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700 h-8 px-2 shrink-0"
                            >
                                <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
                                <span className="text-xs">{translatedContent.reviewHeader}</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-sm">
                            {isLoadingReview ? (
                                <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{translatedContent.generatingReviewTitle}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {translatedContent.generatingReviewDesc}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </div>
                            ) : reviewResult ? (
                                <>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{translatedContent.reviewFor} <span className="text-primary">{reviewResult.productName}</span></AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {translatedContent.analysisOfPotential}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <ScrollArea className="h-72 pr-6">
                                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap pr-4">{reviewResult.aiReview}</div>
                                </ScrollArea>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{translatedContent.close}</AlertDialogCancel>
                                </AlertDialogFooter>
                                </>
                            ) : (
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{translatedContent.getInsightsTitle}</AlertDialogTitle>
                                    <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                                        <Sparkles className="h-12 w-12" />
                                        <p className="mt-4">{translatedContent.getInsightsDesc}</p>
                                    </div>
                                </AlertDialogHeader>
                            )}
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">₹{product.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}
