
'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';
import { getAuth } from 'firebase/auth';
import { useTranslation } from '@/context/translation-context';

const formSchema = z.object({
  recoveryNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit recovery number.'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

const baseTerms = [
    "You agree to provide accurate and complete information during registration.",
    "You are responsible for maintaining the confidentiality of your account and password.",
    "You will only list handmade products that you have created yourself.",
    "You agree not to engage in any fraudulent or deceptive practices.",
    "We reserve the right to suspend or terminate your account for any violation of these terms.",
    "All disputes are subject to the jurisdiction of the local courts.",
];

export default function ArtisanRegisterRecoveryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.artisan_register_recovery_page;
  const [isLoading, setIsLoading] = useState(false);
  const [primaryNumber, setPrimaryNumber] = useState('');
  const { language } = useLanguage();
  const [termsAndConditions, setTermsAndConditions] = useState(baseTerms);

  const auth = getAuth();
  
  useEffect(() => {
     // If user is not logged in or didn't come from register page, redirect
    if (!auth.currentUser) {
        router.push('/artisan/register');
        return;
    }

    const phone = localStorage.getItem('tempPhone');
    if (phone) {
        setPrimaryNumber(phone);
    } else {
        // If the tempPhone is not in storage, it implies they didn't just register.
        // But if they ARE logged in, they shouldn't be on this page.
        router.push('/artisan/post-auth');
    }
  }, [router, auth]);

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const { translatedTexts } = await translateText({ texts: baseTerms, targetLanguage: language });
        setTermsAndConditions(translatedTexts);
      } else {
        setTermsAndConditions(baseTerms);
      }
    };
    translateContent();
  }, [language]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryNumber: '',
      agreeToTerms: false,
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // In a real app, you would save the primary and recovery numbers to your database here.
    // For this prototype, we'll just store it in local storage to simulate.
    const userProfile = {
      primaryPhone: primaryNumber,
      recoveryPhone: values.recoveryNumber,
    };
    localStorage.setItem('artisanFullProfile', JSON.stringify(userProfile));
    localStorage.removeItem('tempPhone');

    toast({
      title: t.accountCreatedToast,
      description: t.accountCreatedToastDesc,
    });

    // Simulate a network request
    setTimeout(() => {
        setIsLoading(false);
        router.push('/artisan/category-selection');
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t.title}</CardTitle>
          <CardDescription>
            {t.description}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <div>
                    <FormLabel>{t.primaryNumberLabel}</FormLabel>
                    <Input value={primaryNumber} disabled />
                </div>
                <FormField
                    control={form.control}
                    name="recoveryNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.recoveryNumberLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={t.recoveryNumberPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <div className="space-y-2">
                    <FormLabel>{t.termsLabel}</FormLabel>
                    <ScrollArea className="h-24 w-full rounded-md border p-3 text-sm">
                        <ul className="list-disc pl-5 space-y-1">
                            {termsAndConditions.map((term, index) => <li key={index}>{term}</li>)}
                        </ul>
                    </ScrollArea>
                     <FormField
                        control={form.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
                            <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>
                                {t.agreeToTermsLabel}
                            </FormLabel>
                            <FormMessage />
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
            </CardContent>
            <CardContent>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.createAccountButton}
                </Button>
            </CardContent>
          </form>
        </Form>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          <Button variant="link" className="text-xs p-0 h-auto">{t.termsLabel}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

      