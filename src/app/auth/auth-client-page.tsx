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
import { useState, useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { useTranslation } from '@/context/translation-context';
import { sendOTP, verifyOTP } from '@/services/firebase-service';

const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().min(5, 'OTP must be 5 digits.').optional(),
});

function AuthClientPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.auth_page;
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('buyer');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'sponsor') {
      setUserType('sponsor');
    } else {
      setUserType('buyer');
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { mobileNumber: '', otp: '' },
  });

  async function handleSendOtp() {
    const { mobileNumber } = form.getValues();
    const mobileResult = z.string().regex(/^\d{10}$/).safeParse(mobileNumber);

    if (!mobileResult.success) {
      form.setError('mobileNumber', { message: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Using our Firebase service to send OTP
      const result = await sendOTP(`+1${mobileNumber}`, null as any);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your mobile number.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!otpSent) {
      handleSendOtp();
      return;
    }

    if (!values.otp || values.otp.length < 5) {
      form.setError('otp', { message: 'OTP must be at least 5 digits.' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verify OTP using our Firebase service
      const result = await verifyOTP(confirmationResult, values.otp);
      
      toast({
        title: t.loginSuccessToast,
        description: t.loginSuccessToastDesc,
      });
      
      // Redirect based on user type
      const redirectPath = userType === 'buyer' ? '/buyer/home' : '/sponsor/dashboard';
      router.push(redirectPath);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
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
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>{t.mobileLabel}</FormLabel>
                    <FormControl><Input placeholder={t.mobilePlaceholder} {...field} disabled={otpSent} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {otpSent && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t.otpLabel}</FormLabel>
                      <FormControl><Input placeholder={t.otpPlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
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