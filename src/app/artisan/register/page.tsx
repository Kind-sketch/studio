
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
import { Logo } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';
import Link from 'next/link';

const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().min(5, 'OTP must be 5 digits.').optional(),
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
    invalidNumber: 'Please enter a valid 10-digit mobile number.',
    termsAndConditions: 'Terms & Conditions',
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
          'Please enter a valid 10-digit mobile number.',
          'Terms & Conditions',
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
          termsAndConditions: translatedTexts[16],
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
    
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast({
          title: translatedContent.otpSentToast,
          description: translatedContent.otpSentToastDesc,
      });
    }, 1000);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    
    if (!values.otp || values.otp.length < 5) {
      form.setError('otp', { message: 'OTP must be at least 5 digits.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Mock OTP verification - accept any OTP
      toast({
        title: translatedContent.welcomeBackToast,
        description: translatedContent.welcomeBackToastDesc,
      });
      router.push('/artisan/category-selection');
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-xs shadow-lg">
        <CardHeader className="text-center">
            <Link href="/role-selection" className="flex justify-center mb-4">
                <Logo className="h-10 w-10 text-primary" />
            </Link>
          <CardTitle className="font-headline text-xl">{translatedContent.title}</CardTitle>
          <CardDescription className="text-sm">
            {translatedContent.description}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{translatedContent.mobileLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={translatedContent.mobilePlaceholder} {...field} disabled={otpSent} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              
              {otpSent && <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translatedContent.otpLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={translatedContent.otpPlaceholder} {...field} disabled={!otpSent || isLoading} className="text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />}

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
        <CardFooter className="justify-center text-xs text-muted-foreground">
          <Button variant="link" className="text-xs p-0 h-auto">{translatedContent.termsAndConditions}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    

    