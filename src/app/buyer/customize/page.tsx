
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { buyerAiDesignedProducts } from '@/ai/flows/buyer-ai-designed-products';
import { productCategories as baseProductCategories } from '@/lib/data';
import 'regenerator-runtime/runtime';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, Mic } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useTranslation } from '@/context/translation-context';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  description: z.string().min(10, 'Please describe your idea in at least 10 characters.'),
  category: z.string().min(1, 'Please select a category.'),
});

export default function CustomizePage() {
  const { toast } = useToast();
  const { translations, isTranslating } = useTranslation();
  const t = translations.customize_page;
  const { language } = useLanguage();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const defaultImage = PlaceHolderImages.find(p => p.id === 'product-5');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      category: '',
    },
  });

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

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        form.setValue('description', transcript);
      };
    }
  }, [language, form, toast]);

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
  
  const handleGenerateImage = async () => {
    const { description, category } = form.getValues();
    if (!description || !category) {
        toast({
            variant: 'destructive',
            title: t.missingInfoToast,
            description: t.missingInfoDesc,
        });
        return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const imageUrl = await buyerAiDesignedProducts({
        prompt: description,
        style: category,
      });
      setGeneratedImage(imageUrl);
      toast({
        title: t.imageGeneratedToast,
        description: t.imageGeneratedDesc,
      });
    } catch (error) {
      console.error(error);
      setGeneratedImage(defaultImage?.imageUrl || '');
      toast({
        variant: 'destructive',
        title: t.generationFailedToast,
        description: t.generationFailedDesc,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!generatedImage) {
        toast({
            variant: 'destructive',
            title: t.noImageToast,
            description: t.noImageDesc,
        });
        return;
    }
    
    setIsSubmitting(true);
    // Simulate sending the request to an artisan
    console.log('Submitting request:', { ...values, imageUrl: generatedImage });
    
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: t.requestSentToast,
            description: t.requestSentDesc,
        });
        form.reset();
        setGeneratedImage(null);
    }, 1500);
  }

  const getCategoryDisplayValue = (value: string) => {
    const index = baseProductCategories.findIndex(c => c === value);
    if (index !== -1 && translations.product_categories.length > index) {
      return translations.product_categories[index];
    }
    return value;
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-2xl md:text-3xl">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.productDescriptionLabel}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder={t.productDescriptionPlaceholder}
                        className="h-32 pr-12"
                      />
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost" 
                        onClick={handleMicClick}
                        className={cn("absolute right-2 top-1/2 -translate-y-1/2", isListening && "bg-destructive text-destructive-foreground")}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.craftCategoryLabel}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t.selectCategoryPlaceholder}>
                                {getCategoryDisplayValue(field.value)}
                            </SelectValue>
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {baseProductCategories.map((cat, index) => (
                            <SelectItem key={cat} value={cat}>
                                {translations.product_categories[index] || cat}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}/>

              <Button type="button" onClick={handleGenerateImage} disabled={isGenerating} className="w-full">
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.generatingImageButton}</> : <><Sparkles className="mr-2 h-4 w-4" />{t.generateImageButton}</>}
              </Button>

              <div className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg bg-secondary overflow-hidden">
                {isGenerating ? (
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                ) : generatedImage ? (
                    <Image src={generatedImage} alt="AI generated craft" fill className="object-cover"/>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                        <Sparkles className="w-8 h-8 mb-2" />
                        <p className="text-sm font-semibold">{t.imagePlaceholder}</p>
                    </div>
                )}
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting || !generatedImage}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.sendingRequestButton}</> : <><Send className="mr-2 h-4 w-4" />{t.sendRequestButton}</>}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
