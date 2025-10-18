
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, Suspense, useRef } from 'react';
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


function AuthClientPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { translations } = useTranslation();
  const { language } = useLanguage();
  const t = translations.auth_page;
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('buyer');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const auth = getAuth();
  
  useEffect(() => {
    if (recaptchaContainerRef.current && !verifierRef.current) {
        verifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible'
        });
    }
  }, [auth]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { mobileNumber: '', otp: '' },
  });

  useEffect(() => {
    const role = searchParams.get('role');
    const type = role === 'sponsor' ? 'sponsor' : 'buyer';
    setUserType(type);
  }, [searchParams]);

  async function handleSendOtp() {
    const { mobileNumber } = form.getValues();
    const mobileResult = z.string().regex(/^\d{10}$/).safeParse(mobileNumber);

     if (!mobileResult.success) {
      form.setError('mobileNumber', { message: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsLoading(true);
    
    auth.languageCode = language;

    const phoneNumber = `+91${mobileNumber}`;

    try {
        if (!verifierRef.current) {
            throw new Error("RecaptchaVerifier not initialized.");
        }
        const result = await signInWithPhoneNumber(auth, phoneNumber, verifierRef.current);
        setConfirmationResult(result);
        setOtpSent(true);
        toast({
            title: 'OTP Sent',
            description: 'An OTP has been sent to your mobile number.',
        });
    } catch (error: any) {
        console.error("signInWithPhoneNumber Error:", error);
        toast({ variant: 'destructive', title: 'Error', description: error.message });
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
        await confirmationResult.confirm(values.otp);
        toast({
            title: t.loginSuccessToast,
            description: t.loginSuccessToastDesc,
        });
        const redirectPath = userType === 'buyer' ? '/buyer/home' : '/sponsor/dashboard';
        router.push(redirectPath);
    } catch (error: any) {
        console.error("OTP Verification Error:", error);
        toast({
            variant: 'destructive',
            title: t.invalidOtpToast,
            description: error.message || t.invalidOtpToastDesc,
        });
    } finally {
        setIsLoading(false);
    }
  }
  
  const getTitle = () => {
    if (userType === 'sponsor') {
        return t.sponsorTab || 'Sponsor Login';
    }
    return t.buyerTab || 'Buyer Login';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-xs shadow-lg">
        <CardHeader className="text-center">
          <Link href="/role-selection" className="flex justify-center mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </Link>
          <CardTitle className="font-headline text-2xl">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.mobileLabel}</FormLabel>
                    <FormControl><Input placeholder={t.mobilePlaceholder} {...field} disabled={otpSent} /></FormControl>
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
                      <FormControl><Input placeholder="Enter 6-digit OTP" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              
              {otpSent ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.verifyButton}
                </Button>
              ) : (
                <Button type="button" onClick={handleSendOtp} className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.sendOtpButton}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center text-xs text-muted-foreground">
          <div ref={recaptchaContainerRef} className="my-2"></div>
          <Button variant="link" className="text-xs p-0 h-auto">{t.termsAndConditions}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthClientPage() {
    return (
        <Suspense>
            <AuthClientPageComponent />
        </Suspense>
    )
}
