
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
import { Loader2, Lightbulb, Play, Pause, RotateCcw, Mic, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { useTranslation } from '@/context/translation-context';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import 'regenerator-runtime/runtime';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';


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
  const { language } = useLanguage();
  const t = translations.artisan_home;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const myProducts = allProducts.filter(p => p.artisan.id === CURRENT_ARTISAN_ID);
  const frequentlyBought = [...myProducts].sort((a, b) => b.sales - a.sales);
  const bestSelling = [...myProducts].sort((a, b) => b.likes - a.likes);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { productDescription: '' },
  });

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

   useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({ variant: 'destructive', title: 'Voice Error', description: 'Could not recognize your voice.' });
        setIsListening(false);
      };

      recognitionRef.current.onresult = async (event: any) => {
        const command = event.results[0][0].transcript;
        form.setValue('productDescription', command);
        await onSubmit({ productDescription: command });
      };
    }
  }, [language, form, toast]);


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


  const handlePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            if (audioRef.current.ended) {
                audioRef.current.currentTime = 0;
            }
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      toast({ variant: 'destructive', title: 'Not Supported', description: 'Voice commands are not supported on this browser.' });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted/40 overflow-x-hidden">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2 px-4 pt-6">
          <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">{t.pageTitle}</h2>
            <p className="text-muted-foreground text-sm">{t.pageDescription}</p>
          </div>
        </div>

        {/* Frequently Bought Products */}
        <section className="space-y-4">
          <h3 className="font-headline text-xl font-semibold px-4">{t.frequentlyBought}</h3>
           <Carousel 
            opts={{ align: 'start', loop: true }}
            plugins={[Autoplay({ delay: 2000, stopOnInteraction: true })]} 
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {frequentlyBought.map((product, index) => (
                <CarouselItem key={product.id} className="basis-1/2 pl-4">
                   <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          </Carousel>
        </section>

        {/* Bestselling Products */}
        <section className="space-y-4">
            <h3 className="font-headline text-xl font-semibold px-4">{t.bestselling}</h3>
             <Carousel 
              opts={{ align: 'start', loop: true }} 
              plugins={[Autoplay({ delay: 2000, stopOnInteraction: true, playOnInit: true, direction: 'backward' })]} 
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                  {bestSelling.map((product, index) => (
                      <CarouselItem key={product.id} className="basis-1/2 pl-4">
                          <ProductCard product={product} />
                      </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            </Carousel>
        </section>

        {/* AI Review Section */}
        <section className="p-4 md:p-6">
             <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t.aiReviewTitle}</CardTitle>
                <CardDescription className="text-xs">{t.aiReviewDescription}</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent>
                    <div className="relative">
                      <FormField
                        control={form.control}
                        name="productDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">{t.productDescriptionLabel}</FormLabel>
                            <FormControl>
                              <Textarea placeholder={t.productDescriptionPlaceholder} {...field} className="h-24 text-sm pr-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <Button 
                          type="button" 
                          size="icon" 
                          variant="ghost" 
                          onClick={handleMicClick}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          <Mic className={`h-5 w-5 ${isListening ? 'text-destructive' : ''}`} />
                        </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading} size="sm" className="w-full">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                      {isLoading ? t.analyzingButton : t.getReviewButton}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            {result && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-md">{t.aiGeneratedInsightsTitle}</CardTitle>
                         {result.aiReviewAudio && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className={cn("h-8 w-8 rounded-full", isPlaying && "bg-accent text-accent-foreground")}
                                onClick={handlePlayPause}
                                aria-label={t.playAudio}
                            >
                                <Volume2 className="h-5 w-5" />
                                <audio ref={audioRef} src={result.aiReviewAudio} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={handleAudioEnded} />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.aiReview}</p>
                </CardContent>
              </Card>
            )}
        </section>
      </div>
    </div>
  );
}
