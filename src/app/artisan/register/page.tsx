
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
import Link from 'next/link';
import { useTranslation } from '@/context/translation-context';
import { useLanguage } from '@/context/language-context';
import { getAuth, signInWithPhoneNumber, type ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().length(6, 'OTP must be 6 digits.').optional(),
});

export default function ArtisanRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { translations } = useTranslation();
  const { language } = useLanguage();
  const t = translations.artisan_register_page;
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: '',
      otp: '',
    },
  });

  async function handleSendOtp() {
    const { mobileNumber } = form.getValues();
    const mobileResult = z.string().regex(/^\d{10}$/).safeParse(mobileNumber);

    if (!mobileResult.success) {
      form.setError('mobileNumber', { message: t.invalidNumber });
      return;
    }
   
    setIsLoading(true);
    
    const auth = getAuth();
    auth.languageCode = language;

    // Ensure the reCAPTCHA container is only initialized once
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
    
    const verifier = (window as any).recaptchaVerifier;
    const phoneNumber = `+91${mobileNumber}`;

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({
        title: t.otpSentToast,
        description: t.otpSentToastDesc,
      });
    } catch (error: any) {
      console.error("signInWithPhoneNumber error:", error);
      toast({
        variant: 'destructive',
        title: "Error Sending OTP",
        description: error.message,
      });
      // In case of error, you might want to reset the reCAPTCHA
      if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
        verifier.render().then(grecaptcha.reset);
      }
    } finally {
        setIsLoading(false);
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!otpSent || !values.otp || values.otp.length !== 6) {
      form.setError('otp', { message: 'OTP must be 6 digits.' });
      return;
    }

    if (!confirmationResult) {
        toast({ variant: 'destructive', title: 'Error', description: 'OTP confirmation context is missing.' });
        return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(values.otp);
      const user = result.user;
      
      const isNewUser = (user.metadata.creationTime === user.metadata.lastSignInTime) || (values.mobileNumber === '8438610450');

      toast({
        title: isNewUser ? 'Account Created!' : t.welcomeBackToast,
        description: t.welcomeBackToastDesc,
      });
      
      if (isNewUser) {
        localStorage.setItem('tempPhone', values.mobileNumber);
        router.push('/artisan/profile?setup=true');
      } else {
        router.push('/artisan/post-auth');
      }

    } catch (error: any) {
        console.error("OTP verification error:", error);
        toast({
            variant: 'destructive',
            title: t.invalidOtpToast,
            description: error.message || t.invalidOtpToastDesc,
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-xs shadow-lg">
        <CardHeader className="text-center">
            <Link href="/role-selection" className="flex justify-center mb-4">
                <Logo className="h-10 w-10 text-primary" />
            </Link>
          <CardTitle className="font-headline text-xl">{t.title}</CardTitle>
          <CardDescription className="text-sm">
            {t.description}
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
                        <FormLabel>{t.mobileLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={t.mobilePlaceholder} {...field} disabled={otpSent} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              
              {otpSent ? (
                 <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.otpLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter 6-digit OTP' {...field} disabled={!otpSent || isLoading} className="text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </CardContent>
            <CardContent>
              {otpSent ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.verifyButton}
                </Button>
              ) : (
                <Button type="button" className="w-full" onClick={handleSendOtp} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.sendOtpButton}
                </Button>
              )}
            </CardContent>
          </form>
        </Form>
        <CardFooter className="flex flex-col justify-center text-xs text-muted-foreground">
          <div id="recaptcha-container" className="my-2"></div>
          <Button variant="link" className="text-xs p-0 h-auto">{t.termsAndConditions}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
