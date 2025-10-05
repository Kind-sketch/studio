'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateProductListing } from '@/ai/flows/artisan-product-listing';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/lib/data';

const formSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters.'),
  productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
  productCategory: z.string().min(1, 'Please select a category.'),
  targetAudience: z.string().min(3, 'Target audience must be at least 3 characters.'),
  socialMediaPlatform: z.string().min(1, 'Please select a social media platform.'),
  keywords: z.string().min(3, 'Please provide at least one keyword.'),
});

export default function PromoteCraftPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    generatedDescription: string;
    generatedSocialMediaContent: string;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      productDescription: '',
      productCategory: '',
      targetAudience: 'Home decor enthusiasts',
      socialMediaPlatform: 'Instagram',
      keywords: 'handmade, rustic, unique',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateProductListing(values);
      setResult(response);
      toast({
        title: 'Content Generated!',
        description: 'Your product listing has been enhanced by AI.',
      });
    } catch (error) {
      console.error('Error generating listing:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was an error generating content. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">AI-Powered Craft Promotion</h1>
        <p className="text-muted-foreground">Let AI help you create compelling product listings and social media posts.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Provide information about your product.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="productName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Handcrafted Ceramic Mug" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="productDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe the product's features, materials, and dimensions." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField control={form.control} name="productCategory" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                        <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="targetAudience" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl><Input placeholder="e.g., Young adults, collectors" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </div>
                 <div className="grid gap-4 md:grid-cols-2">
                    <FormField control={form.control} name="socialMediaPlatform" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Social Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Pinterest">Pinterest</SelectItem>
                            <SelectItem value="Twitter">X (Twitter)</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="keywords" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl><Input placeholder="e.g., handmade, ceramic, gift" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Content</>}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI-Generated Content</CardTitle>
            <CardDescription>Review and copy the content generated by our AI.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary/50 p-8 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12" />
                <p className="mt-4">Your AI-generated content will appear here.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline text-lg font-semibold mb-2">Generated Description</h3>
                  <Textarea readOnly value={result.generatedDescription} className="h-40 bg-white"/>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold mb-2">Generated Social Media Post</h3>
                  <Textarea readOnly value={result.generatedSocialMediaContent} className="h-40 bg-white"/>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
