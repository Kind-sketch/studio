
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';


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
    salesHeader: 'Sales',
    likesHeader: 'Likes',
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
        const values = Object.values(translatedContent);
        const { translatedTexts } = await translateText({ texts: values, targetLanguage: language });
        const newContent: any = {};
        Object.keys(translatedContent).forEach((key, index) => {
          newContent[key] = translatedTexts[index];
        });
        setTranslatedContent(newContent);
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
    return translatedContent[period];
  }

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
        <h1 className="font-headline text-3xl font-bold">{translatedContent.title}</h1>
        <p className="text-sm text-muted-foreground">{translatedContent.description}</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{translatedContent.likesVsSales}</CardTitle>
              <CardDescription>
                {translatedContent.showingDataFor} {getPeriodText()} {translatedContent.performance}.
              </CardDescription>
            </div>
            <Tabs defaultValue={period} onValueChange={onPeriodChange} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto text-xs">
                <TabsTrigger value="weekly">{translatedContent.weekly}</TabsTrigger>
                <TabsTrigger value="monthly">{translatedContent.monthly}</TabsTrigger>
                <TabsTrigger value="yearly">{translatedContent.yearly}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="w-[800px] h-[300px] pr-4">
              <StatsChart data={activeData} config={chartConfig} dataKey={dataKey}/>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>{translatedContent.productPerformance}</CardTitle>
            <CardDescription>{translatedContent.productPerformanceDesc}</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{translatedContent.productHeader}</TableHead>
                        <TableHead className="text-center">{translatedContent.salesHeader}</TableHead>
                        <TableHead className="text-center">{translatedContent.likesHeader}</TableHead>
                        <TableHead className="text-right">{translatedContent.reviewHeader}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map(product => (
                        <TableRow key={product.id}>
                            <TableCell className="flex items-center gap-2 sm:gap-4">
                                <Image src={product.image.url} alt={product.name} width={48} height={48} className="rounded-md object-cover aspect-square bg-muted"/>
                                <div className="flex-1 text-sm">
                                    <p className="font-medium truncate">{product.name}</p>
                                    <p className="text-muted-foreground">₹{product.price.toFixed(2)}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">{product.sales}</TableCell>
                            <TableCell className="text-center font-medium">{product.likes}</TableCell>
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleAiReview(product)}
                                            className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700"
                                        >
                                            <Lightbulb className="mr-0 sm:mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Review</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-2xl">
                                        {isLoadingReview ? (
                                            <div className="flex h-64 items-center justify-center">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{translatedContent.generatingReviewTitle}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {translatedContent.generatingReviewDesc}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                            </div>
                                        ) : reviewResult ? (
                                            <>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{translatedContent.reviewFor} <span className="text-primary">{reviewResult.productName}</span></AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {translatedContent.analysisOfPotential}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <ScrollArea className="h-96 pr-6">
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
