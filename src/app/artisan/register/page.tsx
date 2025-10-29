
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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { useTranslation } from '@/context/translation-context';


const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().min(5, 'OTP must be 5 digits.').optional(),
});

export default function ArtisanRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { translations } = useTranslation();
  const t = translations.artisan_register_page;

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
      form.setError('mobileNumber', { message: t.invalidNumber });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast({
          title: t.otpSentToast,
          description: t.otpSentToastDesc,
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
        title: t.welcomeBackToast,
        description: t.welcomeBackToastDesc,
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
              
              {otpSent && <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.otpLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.otpPlaceholder} {...field} disabled={!otpSent || isLoading} className="text-sm" />
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
        <CardFooter className="justify-center text-xs text-muted-foreground">
          <Button variant="link" className="text-xs p-0 h-auto">{t.termsAndConditions}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
