
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateProductImageFromReference } from '@/ai/flows/generate-product-image-from-reference';
import 'regenerator-runtime/runtime';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, Mic, ChevronLeft, Upload } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  description: z.string().min(10, 'Please describe your idea in at least 10 characters.'),
});

export default function CustomizeWithReferencePage() {
  const router = useRouter();
  const { toast } = useToast();
  // Using customize_page translations as the content is very similar
  const { translations } = useTranslation();
  const t = translations.customize_page;
  const { language } = useLanguage();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        setGeneratedImage(null); // Clear previous generation
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateImage = async () => {
    const { description } = form.getValues();
    if (!description || !referenceImage) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please upload a reference image and provide a description.',
        });
        return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateProductImageFromReference({
        prompt: description,
        referenceImageUrl: referenceImage,
      });
      setGeneratedImage(imageUrl);
      toast({
        title: t.imageGeneratedToast,
        description: t.imageGeneratedDesc,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t.generationFailedToast,
        description: "The AI failed to generate an image from your reference. Please try again.",
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
    console.log('Submitting request with reference:', { ...values, generatedImageUrl: generatedImage, referenceImageUrl: referenceImage });
    
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: t.requestSentToast,
            description: t.requestSentDesc,
        });
        form.reset();
        setReferenceImage(null);
        setGeneratedImage(null);
    }, 1500);
  }


  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button onClick={() => router.back()} variant="ghost" className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card className="w-full shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-2xl md:text-3xl">Customize with Reference</CardTitle>
            <CardDescription>Upload an image and describe the changes you'd like an artisan to make.</CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              
              <FormItem>
                <FormLabel>Reference Image</FormLabel>
                <FormControl>
                    <div 
                        className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg bg-secondary overflow-hidden cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {referenceImage ? (
                            <Image src={referenceImage} alt="Reference Preview" fill className="object-contain"/>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                                <Upload className="w-8 h-8 mb-2" />
                                <p className="text-sm font-semibold">Click to upload an image</p>
                            </div>
                        )}
                        <Input 
                            id="reference-image-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
                
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe Your Changes</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder={"e.g., 'Change the color to blue and add a handle...'"}
                        className="h-32 pr-12"
                        disabled={!referenceImage}
                      />
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost" 
                        onClick={handleMicClick}
                        disabled={!referenceImage}
                        className={cn("absolute right-2 top-1/2 -translate-y-1/2", isListening && "bg-destructive text-destructive-foreground")}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>

              <Button type="button" onClick={handleGenerateImage} disabled={isGenerating || !referenceImage} className="w-full">
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{'Generating New Image...'}</> : <><Sparkles className="mr-2 h-4 w-4" />{'Visualize My Changes'}</>}
              </Button>

              <div className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg bg-secondary overflow-hidden">
                {isGenerating ? (
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                ) : generatedImage ? (
                    <Image src={generatedImage} alt="AI generated craft from reference" fill className="object-cover"/>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                        <Sparkles className="w-8 h-8 mb-2" />
                        <p className="text-sm font-semibold">Your new image will appear here</p>
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
