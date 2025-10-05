'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  craft: z.string().min(3, 'Please specify your craft.'),
  bio: z.string().min(20, 'Bio must be at least 20 characters.').max(200, 'Bio must be less than 200 characters.'),
});

export default function ArtisanProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Create Your Artisan Profile',
    description: 'Tell the community about yourself and your art.',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Your full name',
    craftLabel: 'Primary Craft',
    craftPlaceholder: 'e.g., Pottery, Weaving, Painting',
    bioLabel: 'Short Bio',
    bioPlaceholder: 'A brief introduction about you and your artistic journey.',
    submitButton: 'Complete Profile',
    successToast: 'Profile Created!',
    successToastDesc: "Welcome to Artistry Havens! You're all set.",
  });
  
  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = [
          'Create Your Artisan Profile',
          'Tell the community about yourself and your art.',
          'Full Name',
          'Your full name',
          'Primary Craft',
          'e.g., Pottery, Weaving, Painting',
          'Short Bio',
          'A brief introduction about you and your artistic journey.',
          'Complete Profile',
          'Profile Created!',
          "Welcome to Artistry Havens! You're all set.",
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        setTranslatedContent({
          title: translatedTexts[0],
          description: translatedTexts[1],
          fullNameLabel: translatedTexts[2],
          fullNamePlaceholder: translatedTexts[3],
          craftLabel: translatedTexts[4],
          craftPlaceholder: translatedTexts[5],
          bioLabel: translatedTexts[6],
          bioPlaceholder: translatedTexts[7],
          submitButton: translatedTexts[8],
          successToast: translatedTexts[9],
          successToastDesc: translatedTexts[10],
        });
      }
    };
    translateContent();
  }, [language]);


  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      craft: '',
      bio: '',
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: translatedContent.successToast,
        description: translatedContent.successToastDesc,
      });
      router.push('/artisan/home');
    }, 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
          <CardDescription>{translatedContent.description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translatedContent.fullNameLabel}</FormLabel>
                    <FormControl><Input placeholder={translatedContent.fullNamePlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="craft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translatedContent.craftLabel}</FormLabel>
                    <FormControl><Input placeholder={translatedContent.craftPlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translatedContent.bioLabel}</FormLabel>
                    <FormControl><Textarea placeholder={translatedContent.bioPlaceholder} {...field} className="h-28" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {translatedContent.submitButton}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
