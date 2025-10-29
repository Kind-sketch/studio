
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { Loader2, Lightbulb, Mic, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Product, SavedCollection } from '@/lib/types';
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
  const mostLikedProducts = [...myProducts].sort((a, b) => b.likes - a.likes);
  const frequentlyBoughtProducts = [...myProducts].sort((a, b) => b.sales - a.sales);

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
        if (event.error === 'no-speech') {
          setIsListening(false);
          return;
        }
        console.error('Speech recognition error:', event.error);
        if (event.error === 'network') {
          toast({
            variant: 'destructive',
            title: 'Voice Service Unavailable',
            description: 'Please check your network connection.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Voice Error',
            description: 'Could not recognize your voice.',
          });
        }
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        form.setValue('productDescription', command);
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

  const handleSaveProduct = useCallback((productId: string) => {
    const collections: SavedCollection[] = JSON.parse(localStorage.getItem('artisanCollections') || '[]');
    let inspirationCollection = collections.find(c => c.name === 'Inspiration');
    
    if (!inspirationCollection) {
        inspirationCollection = { id: `col-${Date.now()}`, name: 'Inspiration', productIds: [] };
        collections.push(inspirationCollection);
    }

    if (!inspirationCollection.productIds.includes(productId)) {
        inspirationCollection.productIds.push(productId);
        localStorage.setItem('artisanCollections', JSON.stringify(collections));
        toast({
            title: t.savedToCollectionToast.replace('{collectionName}', inspirationCollection.name),
        });
    }
  }, [toast, t.savedToCollectionToast]);

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div>
        <h2 className="font-headline text-2xl font-bold tracking-tight truncate">{t.pageTitle}</h2>
        <p className="text-muted-foreground text-sm truncate">{t.pageDescription}</p>
      </div>

      <div className="space-y-4 pt-4">
        {/* Frequently Bought Products */}
        <section className="space-y-2">
            <h3 className="font-headline text-lg font-semibold truncate">Frequently Bought Products</h3>
            <Carousel 
                opts={{ align: 'start', loop: true, direction: 'rtl' }}
                plugins={[Autoplay({ delay: 2000, stopOnInteraction: false, playOnInit: true, direction: 'backward' })]} 
                className="w-full"
            >
                <CarouselContent>
                {frequentlyBoughtProducts.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/3 pl-2">
                    <ProductCard product={product} onSave={() => handleSaveProduct(product.id)} showSaveButton />
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
                <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
            </Carousel>
        </section>

        {/* Most Liked Products */}
        <section className="space-y-2">
          <h3 className="font-headline text-lg font-semibold truncate">{t.mostLiked}</h3>
           <Carousel 
            opts={{ align: 'start', loop: true }}
            plugins={[Autoplay({ delay: 2000, stopOnInteraction: false, playOnInit: true, direction: 'forward' })]} 
            className="w-full"
          >
            <CarouselContent>
              {mostLikedProducts.map((product) => (
                <CarouselItem key={product.id} className="basis-1/3 pl-2">
                   <ProductCard product={product} onSave={() => handleSaveProduct(product.id)} showSaveButton />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
          </Carousel>
        </section>

        {/* AI Review Section */}
        <section>
             <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-md leading-tight">{t.aiReviewTitle}</CardTitle>
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
                              <Textarea placeholder={t.productDescriptionPlaceholder} {...field} className="h-20 text-sm pr-12" />
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
                          <Mic className={cn("h-5 w-5", isListening && "text-destructive")} />
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
              <Card className="mt-4">
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
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{result.aiReview}</p>
                </CardContent>
              </Card>
            )}
        </section>
      </div>
    </div>
  );
}
