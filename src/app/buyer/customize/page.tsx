
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { buyerAiDesignedProducts } from '@/ai/flows/buyer-ai-designed-products';
import { productCategories } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  description: z.string().min(10, 'Please describe your idea in at least 10 characters.'),
  category: z.string().min(1, 'Please select a category.'),
});

export default function CustomizePage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const defaultImage = PlaceHolderImages.find(p => p.id === 'product-5');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      category: '',
    },
  });
  
  const handleGenerateImage = async () => {
    const { description, category } = form.getValues();
    if (!description || !category) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please provide a description and select a category.',
        });
        return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const result = await buyerAiDesignedProducts({
        prompt: description,
        style: category,
      });
      setGeneratedImage(result.imageUrl);
      toast({
        title: 'Image Generated!',
        description: 'Here is a visualization of your idea.',
      });
    } catch (error) {
      console.error(error);
      setGeneratedImage(defaultImage?.imageUrl || '');
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'The AI is busy right now. Please try again later. Here is a placeholder image.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!generatedImage) {
        toast({
            variant: 'destructive',
            title: 'No Image',
            description: 'Please generate an image before submitting.',
        });
        return;
    }
    
    setIsSubmitting(true);
    // Simulate sending the request to an artisan
    console.log('Submitting request:', { ...values, imageUrl: generatedImage });
    
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: 'Request Sent!',
            description: 'An artisan from the selected category has been notified of your request.',
        });
        form.reset();
        setGeneratedImage(null);
    }, 1500);
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-2xl md:text-3xl">Design Your Own Craft</CardTitle>
            <CardDescription>Describe your idea, and our AI will visualize it. Then, we'll connect you with a skilled artisan.</CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g., 'A ceramic mug with a mountain landscape and a starry night sky glaze...'"
                      className="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Craft Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category..."/>
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {productCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}/>

              <Button type="button" onClick={handleGenerateImage} disabled={isGenerating} className="w-full">
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Image...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Image with AI</>}
              </Button>

              <div className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg bg-secondary overflow-hidden">
                {isGenerating ? (
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                ) : generatedImage ? (
                    <Image src={generatedImage} alt="AI generated craft" fill className="object-cover"/>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                        <Sparkles className="w-8 h-8 mb-2" />
                        <p className="text-sm font-semibold">Your AI-generated image will appear here</p>
                    </div>
                )}
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting || !generatedImage}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending Request</> : <><Send className="mr-2 h-4 w-4" />Send Request to Artisan</>}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
