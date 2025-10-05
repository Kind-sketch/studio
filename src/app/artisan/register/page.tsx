'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().length(5, 'OTP must be 5 digits.'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

export default function ArtisanRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    title: 'Artisan Login',
    description: 'Enter your mobile number to login or register.',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: '10-digit mobile number',
    sendOtpButton: 'Send OTP',
    otpDescription: 'Enter the OTP sent to your mobile.',
    otpLabel: 'One-Time Password (OTP)',
    otpPlaceholder: 'Enter 5-digit OTP',
    verifyButton: 'Verify & Continue',
    otpSentToast: 'OTP Sent',
    otpSentToastDesc: 'An OTP has been sent to your mobile number.',
    invalidOtpToast: 'Invalid OTP',
    invalidOtpToastDesc: 'The OTP you entered is incorrect. Please try again.',
    welcomeBackToast: 'Verification Successful',
    welcomeBackToastDesc: 'Welcome back!',
    invalidNumber: 'Please enter a valid 10-digit mobile number.'
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = [
          'Artisan Login',
          'Enter your mobile number to login or register.',
          'Mobile Number',
          '10-digit mobile number',
          'Send OTP',
          'Enter the OTP sent to your mobile.',
          'One-Time Password (OTP)',
          'Enter 5-digit OTP',
          'Verify & Continue',
          'OTP Sent',
          'An OTP has been sent to your mobile number.',
          'Invalid OTP',
          'The OTP you entered is incorrect. Please try again.',
          'Verification Successful',
          'Welcome back!',
          'Please enter a valid 10-digit mobile number.'
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        setTranslatedContent({
          title: translatedTexts[0],
          description: translatedTexts[1],
          mobileLabel: translatedTexts[2],
          mobilePlaceholder: translatedTexts[3],
          sendOtpButton: translatedTexts[4],
          otpDescription: translatedTexts[5],
          otpLabel: translatedTexts[6],
          otpPlaceholder: translatedTexts[7],
          verifyButton: translatedTexts[8],
          otpSentToast: translatedTexts[9],
          otpSentToastDesc: translatedTexts[10],
          invalidOtpToast: translatedTexts[11],
          invalidOtpToastDesc: translatedTexts[12],
          welcomeBackToast: translatedTexts[13],
          welcomeBackToastDesc: translatedTexts[14],
          invalidNumber: translatedTexts[15],
        });
      }
    };
    translateContent();
  }, [language]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: '',
      otp: '',
      agreeToTerms: false,
    },
  });

  function handleSendOtp() {
    const { mobileNumber } = form.getValues();
    const mobileResult = z.string().regex(/^\d{10}$/).safeParse(mobileNumber);

     if (!mobileResult.success) {
      form.setError('mobileNumber', { message: translatedContent.invalidNumber });
      return;
    }

    setIsLoading(true);
    // Mock check if number exists. In a real app, this would be a backend call.
    const existingUsers = JSON.parse(localStorage.getItem('artisanUsers') || '{}');
    const isExistingUser = Object.values(existingUsers).some((user: any) => user.phone === mobileNumber || user.recovery === mobileNumber);
    localStorage.setItem('tempPhone', mobileNumber);

    setTimeout(() => {
      if (!isExistingUser) {
          router.push('/artisan/register-recovery');
      } else {
        setOtpSent(true);
        setIsLoading(false);
        toast({
            title: translatedContent.otpSentToast,
            description: translatedContent.otpSentToastDesc,
        });
      }
    }, 1000);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Mock OTP verification
      if (values.otp === '12345') {
        toast({
          title: translatedContent.welcomeBackToast,
          description: translatedContent.welcomeBackToastDesc,
        });
        router.push('/artisan/home');
      } else {
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
      <Card className="w-full shadow-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
          <CardDescription>
            {otpSent ? translatedContent.otpDescription : translatedContent.description}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {!otpSent && (
                <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{translatedContent.mobileLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={translatedContent.mobilePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}
              {otpSent && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translatedContent.otpLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={translatedContent.otpPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            </CardContent>
            <CardContent>
              {otpSent ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {translatedContent.verifyButton}
                </Button>
              ) : (
                <Button type="button" className="w-full" onClick={handleSendOtp} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {translatedContent.sendOtpButton}
                </Button>
              )}
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
