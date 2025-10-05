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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().length(5, 'OTP must be 5 digits.'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

const termsAndConditions = [
    "You agree to provide accurate and complete information during registration.",
    "You are responsible for maintaining the confidentiality of your account and password.",
    "You will only list handmade products that you have created yourself.",
    "You agree not to engage in any fraudulent or deceptive practices.",
    "We reserve the right to suspend or terminate your account for any violation of these terms.",
    "All disputes are subject to the jurisdiction of the local courts.",
];


export default function ArtisanRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      form.setError('mobileNumber', { message: 'Please enter a valid 10-digit mobile number.' });
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
            title: 'OTP Sent',
            description: 'An OTP has been sent to your mobile number.',
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
          title: 'Verification Successful',
          description: 'Welcome back!',
        });
        router.push('/artisan/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid OTP',
          description: 'The OTP you entered is incorrect. Please try again.',
        });
      }
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl">Artisan Login</CardTitle>
          <CardDescription>
            {otpSent ? 'Enter the OTP sent to your mobile.' : 'Enter your mobile number to login or register.'}
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
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                        <Input placeholder="10-digit mobile number" {...field} />
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
                      <FormLabel>One-Time Password (OTP)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 5-digit OTP" {...field} />
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
                  Verify & Continue
                </Button>
              ) : (
                <Button type="button" className="w-full" onClick={handleSendOtp} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send OTP
                </Button>
              )}
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
