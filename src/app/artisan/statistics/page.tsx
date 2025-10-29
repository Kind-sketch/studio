
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { statsData } from "@/lib/data";
import StatsChart from "@/components/stats-chart";
import { ChartConfig } from "@/components/ui/chart";
import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Volume2 } from 'lucide-react';
import { getCommunityTrendInsights } from '@/ai/flows/community-trend-insights';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from '@/context/translation-context';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import TutorialDialog from '@/components/tutorial-dialog';

type View = 'weekly' | 'monthly' | 'yearly';

const chartConfig = {
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-1))",
  },
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface AiReview {
  productId: string;
  review: string;
  audio: string;
}

export default function StatisticsPage() {
  const [view, setView] = useState<View>('monthly');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [aiReview, setAiReview] = useState<AiReview | null>(null);
  const { toast } = useToast();
  const { translations } = useTranslation();
  const { language } = useLanguage();
  const t = translations.stats_page;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentOpenDialog, setCurrentOpenDialog] = useState<string | null>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleGenerateReview = async (productId: string, productDescription: string) => {
    setIsGenerating(productId);
    setAiReview(null);
    try {
      const result = await getCommunityTrendInsights({ 
        artisanId: '1', 
        productDescription,
        language,
      });
      setAiReview({
        productId: productId,
        review: result.aiReview,
        audio: result.aiReviewAudio,
      });
      toast({
        title: `${t.reviewFor} ${products.find(p => p.id === productId)?.name || 'Product'}`,
        description: t.analysisOfPotential,
      })
    } catch (error) {
      console.error(t.reviewFailed, error);
      toast({
        variant: 'destructive',
        title: t.reviewFailed,
        description: t.reviewFailedDesc,
      });
    } finally {
      setIsGenerating(null);
    }
  }
  
  const onDialogOpenChange = (open: boolean, productId: string) => {
    if (open) {
      setCurrentOpenDialog(productId);
      const product = products.find(p => p.id === productId);
      if (product) {
        handleGenerateReview(productId, product.description);
      }
    } else {
      setCurrentOpenDialog(null);
      setAiReview(null);
       if (audioRef.current && aiReview) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const getButtonVariant = (buttonView: View) => {
    return view === buttonView ? 'default' : 'outline';
  }

  return (
    <div className="container mx-auto p-4 md:p-6 relative">
      <TutorialDialog pageId="statistics" />
      <header className="mb-6 mt-12">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </header>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.likesVsSales}</CardTitle>
          <CardDescription>{t.showingDataFor} {view} {t.performance}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2">
            <Button size="sm" variant={getButtonVariant('weekly')} onClick={() => setView('weekly')}>{t.weekly}</Button>
            <Button size="sm" variant={getButtonVariant('monthly')} onClick={() => setView('monthly')}>{t.monthly}</Button>
            <Button size="sm" variant={getButtonVariant('yearly')} onClick={() => setView('yearly')}>{t.yearly}</Button>
          </div>
          <div className="h-60 w-full">
            <StatsChart data={statsData[view]} config={chartConfig} dataKey={view.slice(0, -2)} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t.productPerformance}</CardTitle>
          <CardDescription>{t.productPerformanceDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.productHeader}</TableHead>
                  <TableHead className="text-right">{t.reviewHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 5).map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="flex items-center gap-2">
                      <Image src={product.image.url} alt={product.name} width={40} height={40} className="rounded-md aspect-square object-cover" />
                      <div>
                          <p className="font-medium truncate max-w-[120px]">{product.name}</p>
                          <p className="text-xs text-muted-foreground">Likes: {product.likes} | Sales: {product.sales}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog onOpenChange={(open) => onDialogOpenChange(open, product.id)}>
                         <DialogTrigger asChild>
                           <Button 
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                'animate-pulse bg-primary/10 text-primary hover:bg-primary/20',
                                isGenerating === product.id && 'animate-spin'
                              )}
                            >
                             {isGenerating === product.id && currentOpenDialog === product.id ? <Loader2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                           </Button>
                         </DialogTrigger>
                         <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{aiReview ? `${t.reviewFor} ${product.name}`: t.generatingReviewTitle}</DialogTitle>
                                <DialogDescription>
                                    {aiReview ? t.analysisOfPotential : t.generatingReviewDesc}
                                </DialogDescription>
                            </DialogHeader>
                            {aiReview ? (
                              <div className="py-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiReview.review}</p>
                                  {aiReview.audio && (
                                      <Button
                                          size="icon"
                                          variant="ghost"
                                          className={cn("h-8 w-8 rounded-full", isPlaying && "bg-accent text-accent-foreground")}
                                          onClick={handlePlayPause}
                                          aria-label="Play audio review"
                                      >
                                          <Volume2 className="h-5 w-5" />
                                          <audio ref={audioRef} src={aiReview.audio} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={handleAudioEnded} />
                                      </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="py-4 flex justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>
                            )}
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">{t.close}</Button>
                            </DialogClose>
                         </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
