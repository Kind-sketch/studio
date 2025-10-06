
'use client';

import { useState } from 'react';
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

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Please describe your desired design in at least 10 characters.',
  }),
  style: z.string().optional(),
});

export default function BuyerCustomizePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    designedProductImage: string;
    description: string;
  } | null>(null);
  const { toast } = useToast();

  const translatedContent = {
    mainTitle: 'Design with AI',
    mainDescription: 'Bring your ideas to life. Let our AI help you create a unique product.',
    cardTitle: 'Create Your Design',
    cardDescription: 'Describe what you want to create, and our AI will generate it for you.',
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
  };


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await buyerAiDesignedProducts({
        prompt: values.prompt,
        style: values.style,
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
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6 text-center">
        <h1 className="font-headline text-3xl font-bold">
          {translatedContent.mainTitle}
        </h1>
        <p className="mt-1 text-md text-muted-foreground">
          {translatedContent.mainDescription}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              {translatedContent.cardTitle}
            </CardTitle>
            <CardDescription>
              {translatedContent.cardDescription}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
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
                          className="h-24"
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
