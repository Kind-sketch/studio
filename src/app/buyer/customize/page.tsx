'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { buyerAiDesignedProducts } from '@/ai/flows/buyer-ai-designed-products';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Please describe your desired design in at least 10 characters.',
  }),
  style: z.string().optional(),
  image: z.any().optional(),
});

export default function BuyerCustomizePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    designedProductImage: string;
    description: string;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    mainTitle: 'Design with AI',
    mainDescription: 'Bring your ideas to life. Let our AI help you create a unique product.',
    cardTitle: 'Create Your Design',
    cardDescription: 'Describe what you want to create, and our AI will generate it for you.',
    uploadLabel: 'Upload an image (optional)',
    uploadHint: 'Click to upload',
    uploadHint2: 'or drag and drop',
    uploadHint3: 'SVG, PNG, JPG or GIF',
    promptLabel: 'Design Prompt',
    promptPlaceholder: 'e.g., A ceramic mug with a galaxy pattern, deep blues and purples...',
    styleLabel: 'Style',
    stylePlaceholder: 'Select a style',
    styles: ['Realistic', 'Cartoon', 'Watercolor', 'Abstract', 'Minimalist'],
    generateButton: 'Generate Design',
    generatingButton: 'Generating...',
    resultTitle: 'Your AI-Generated Design',
    purchaseButton: 'Purchase This Design',
    generatingText: 'Your design is being created...',
    placeholderText: 'Your generated design will appear here.',
    errorToast: 'Design Generation Failed',
    errorToastDesc: 'There was an error generating your custom design. Please try again.',
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = [
          'Design with AI',
          'Bring your ideas to life. Let our AI help you create a unique product.',
          'Create Your Design',
          'Describe what you want to create, and our AI will generate it for you.',
          'Upload an image (optional)',
          'Click to upload',
          'or drag and drop',
          'SVG, PNG, JPG or GIF',
          'Design Prompt',
          'e.g., A ceramic mug with a galaxy pattern, deep blues and purples...',
          'Style',
          'Select a style',
          'Realistic', 'Cartoon', 'Watercolor', 'Abstract', 'Minimalist',
          'Generate Design',
          'Generating...',
          'Your AI-Generated Design',
          'Purchase This Design',
          'Your design is being created...',
          'Your generated design will appear here.',
          'Design Generation Failed',
          'There was an error generating your custom design. Please try again.',
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        setTranslatedContent({
          mainTitle: translatedTexts[0],
          mainDescription: translatedTexts[1],
          cardTitle: translatedTexts[2],
          cardDescription: translatedTexts[3],
          uploadLabel: translatedTexts[4],
          uploadHint: translatedTexts[5],
          uploadHint2: translatedTexts[6],
          uploadHint3: translatedTexts[7],
          promptLabel: translatedTexts[8],
          promptPlaceholder: translatedTexts[9],
          styleLabel: translatedTexts[10],
          stylePlaceholder: translatedTexts[11],
          styles: translatedTexts.slice(12, 17),
          generateButton: translatedTexts[17],
          generatingButton: translatedTexts[18],
          resultTitle: translatedTexts[19],
          purchaseButton: translatedTexts[20],
          generatingText: translatedTexts[21],
          placeholderText: translatedTexts[22],
          errorToast: translatedTexts[23],
          errorToastDesc: translatedTexts[24],
        });
      }
    };
    translateContent();
  }, [language]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        form.setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await buyerAiDesignedProducts({
        prompt: values.prompt,
        style: values.style,
        imageUri: values.image,
      });
      setResult(response);
    } catch (error) {
      console.error('Error generating design:', error);
      toast({
        variant: 'destructive',
        title: translatedContent.errorToast,
        description: translatedContent.errorToastDesc,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold">
          {translatedContent.mainTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {translatedContent.mainDescription}
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {translatedContent.cardTitle}
            </CardTitle>
            <CardDescription>
              {translatedContent.cardDescription}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>{translatedContent.uploadLabel}</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {preview ? (
                                        <Image src={preview} alt="Image preview" width={100} height={100} className="object-contain h-32"/>
                                    ) : (
                                        <>
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{translatedContent.uploadHint}</span> {translatedContent.uploadHint2}</p>
                                        <p className="text-xs text-muted-foreground">{translatedContent.uploadHint3}</p>
                                        </>
                                    )}
                                </div>
                                <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*"/>
                            </label>
                        </div> 
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translatedContent.promptLabel}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={translatedContent.promptPlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translatedContent.styleLabel}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={translatedContent.stylePlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="realistic">{translatedContent.styles[0]}</SelectItem>
                          <SelectItem value="cartoon">{translatedContent.styles[1]}</SelectItem>
                          <SelectItem value="watercolor">{translatedContent.styles[2]}</SelectItem>
                          <SelectItem value="abstract">{translatedContent.styles[3]}</SelectItem>
                          <SelectItem value="minimalist">{translatedContent.styles[4]}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {translatedContent.generatingButton}
                    </>
                  ) : (
                    translatedContent.generateButton
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardContent className="p-4 text-center w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  {translatedContent.generatingText}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">{translatedContent.resultTitle}</h3>
                <div className="aspect-square w-full relative bg-muted rounded-lg overflow-hidden">
                    <Image
                        src={result.designedProductImage}
                        alt="AI generated product"
                        fill
                        className="object-contain"
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.description}
                </p>
                <Button className="w-full">{translatedContent.purchaseButton}</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Sparkles className="h-16 w-16 mb-4" />
                <p>{translatedContent.placeholderText}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
