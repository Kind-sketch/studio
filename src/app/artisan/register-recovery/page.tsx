
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
  const [isLoading, setIsLoading] = useState(false);
  const [primaryNumber, setPrimaryNumber] = useState('');
  const { language } = useLanguage();
  const [termsAndConditions, setTermsAndConditions] = useState(baseTerms);

  const auth = getAuth();
  
  const [translatedContent, setTranslatedContent] = useState({
      title: 'Complete Your Registration',
      description: 'Add a recovery number to secure your account.',
      primaryNumberLabel: 'Primary Number',
      recoveryNumberLabel: 'Recovery Mobile Number',
      recoveryNumberPlaceholder: '10-digit recovery number',
      termsLabel: 'Terms and Conditions',
      agreeToTermsLabel: 'I agree to the terms and conditions.',
      createAccountButton: 'Create Account',
      accountCreatedToast: 'Account Created!',
      accountCreatedToastDesc: "Let's get you started.",
  });

  useEffect(() => {
    const phone = localStorage.getItem('tempPhone');
    if (phone) {
        setPrimaryNumber(phone);
    } else {
        router.push('/artisan/register');
    }
  }, [router]);

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = Object.values(translatedContent).flat();
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        
        let i = 0;
        const newContent: any = {
            title: translatedTexts[i++],
            description: translatedTexts[i++],
            primaryNumberLabel: translatedTexts[i++],
            recoveryNumberLabel: translatedTexts[i++],
            recoveryNumberPlaceholder: translatedTexts[i++],
            termsLabel: translatedTexts[i++],
            agreeToTermsLabel: translatedTexts[i++],
            createAccountButton: translatedTexts[i++],
            accountCreatedToast: translatedTexts[i++],
            accountCreatedToastDesc: translatedTexts[i++],
        };
        setTranslatedContent(newContent);
        setTermsAndConditions(baseTerms);
      } else {
        setTermsAndConditions(baseTerms);
      }
    };
    translateContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title: translatedContent.accountCreatedToast,
      description: translatedContent.accountCreatedToastDesc,
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
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
          <CardDescription>
            {translatedContent.description}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <div>
                    <FormLabel>{translatedContent.primaryNumberLabel}</FormLabel>
                    <Input value={primaryNumber} disabled />
                </div>
                <FormField
                    control={form.control}
                    name="recoveryNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{translatedContent.recoveryNumberLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={translatedContent.recoveryNumberPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <div className="space-y-2">
                    <FormLabel>{translatedContent.termsLabel}</FormLabel>
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
                                {translatedContent.agreeToTermsLabel}
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
                    {translatedContent.createAccountButton}
                </Button>
            </CardContent>
          </form>
        </Form>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          <Button variant="link" className="text-xs p-0 h-auto">{translatedContent.termsLabel}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
