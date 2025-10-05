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
import { translateText } from '@/ai/flows/translate-text';

const formSchema = z.object({
  recoveryNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit recovery number.'),
  primaryOtp: z.string().length(5, 'OTP must be 5 digits.'),
  recoveryOtp: z.string().length(5, 'OTP must be 5 digits.'),
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

  const [translatedContent, setTranslatedContent] = useState({
      title: 'Complete Your Registration',
      description: 'Enter a recovery number and verify both numbers to secure your account.',
      primaryNumberLabel: 'Primary Number',
      primaryOtpLabel: 'OTP for Primary Number',
      otpPlaceholder: 'Enter 5-digit OTP',
      recoveryNumberLabel: 'Recovery Mobile Number',
      recoveryNumberPlaceholder: '10-digit recovery number',
      recoveryOtpLabel: 'OTP for Recovery Number',
      termsLabel: 'Terms and Conditions',
      agreeToTermsLabel: 'I agree to the terms and conditions.',
      verifyButton: 'Verify & Create Account',
      otpSentToast: 'OTPs Sent',
      otpSentToastDesc: 'OTPs have been sent to both primary and recovery numbers.',
      verificationSuccessToast: 'Verification Successful',
      verificationSuccessToastDesc: "Let's set up your profile.",
      invalidOtpToast: 'Invalid OTP',
      invalidOtpToastDesc: 'One or both of the OTPs entered are incorrect. Please try again.',
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
        const textsToTranslate = [
            'Complete Your Registration',
            'Enter a recovery number and verify both numbers to secure your account.',
            'Primary Number',
            'OTP for Primary Number',
            'Enter 5-digit OTP',
            'Recovery Mobile Number',
            '10-digit recovery number',
            'OTP for Recovery Number',
            'Terms and Conditions',
            'I agree to the terms and conditions.',
            'Verify & Create Account',
            'OTPs Sent',
            'OTPs have been sent to both primary and recovery numbers.',
            'Verification Successful',
            "Let's set up your profile.",
            'Invalid OTP',
            'One or both of the OTPs entered are incorrect. Please try again.',
            ...baseTerms,
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        setTranslatedContent({
            title: translatedTexts[0],
            description: translatedTexts[1],
            primaryNumberLabel: translatedTexts[2],
            primaryOtpLabel: translatedTexts[3],
            otpPlaceholder: translatedTexts[4],
            recoveryNumberLabel: translatedTexts[5],
            recoveryNumberPlaceholder: translatedTexts[6],
            recoveryOtpLabel: translatedTexts[7],
            termsLabel: translatedTexts[8],
            agreeToTermsLabel: translatedTexts[9],
            verifyButton: translatedTexts[10],
            otpSentToast: translatedTexts[11],
            otpSentToastDesc: translatedTexts[12],
            verificationSuccessToast: translatedTexts[13],
            verificationSuccessToastDesc: translatedTexts[14],
            invalidOtpToast: translatedTexts[15],
            invalidOtpToastDesc: translatedTexts[16],
        });
        setTermsAndConditions(translatedTexts.slice(17));
      } else {
        setTermsAndConditions(baseTerms);
      }
    };
    translateContent();
  }, [language]);

  useEffect(() => {
    if (primaryNumber) {
        toast({
            title: translatedContent.otpSentToast,
            description: translatedContent.otpSentToastDesc,
        });
    }
  }, [primaryNumber, toast, translatedContent.otpSentToast, translatedContent.otpSentToastDesc]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryNumber: '',
      primaryOtp: '',
      recoveryOtp: '',
      agreeToTerms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      // Mock OTP verification
      if (values.primaryOtp === '12345' && values.recoveryOtp === '54321') {
        const existingUsers = JSON.parse(localStorage.getItem('artisanUsers') || '{}');
        const newUser = {
            phone: primaryNumber,
            recovery: values.recoveryNumber,
        };
        existingUsers[primaryNumber] = newUser;
        localStorage.setItem('artisanUsers', JSON.stringify(existingUsers));
        localStorage.removeItem('tempPhone');

        toast({
          title: translatedContent.verificationSuccessToast,
          description: translatedContent.verificationSuccessToastDesc,
        });
        router.push('/artisan/category-selection');
      } else {
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: translatedContent.invalidOtpToast,
          description: translatedContent.invalidOtpToastDesc,
        });
      }
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
                    name="primaryOtp"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{translatedContent.primaryOtpLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={translatedContent.otpPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
                 <FormField
                    control={form.control}
                    name="recoveryOtp"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{translatedContent.recoveryOtpLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={translatedContent.otpPlaceholder} {...field} />
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
                  {translatedContent.verifyButton}
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
