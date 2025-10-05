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
  aadharNumber: z.string().regex(/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number.'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  recoveryNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit recovery number.').optional().or(z.literal('')),
  otp: z.string().length(6, 'OTP must be 6 digits.'),
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
      aadharNumber: '',
      mobileNumber: '',
      recoveryNumber: '',
      otp: '',
      agreeToTerms: false,
    },
  });

  function handleSendOtp() {
    const { aadharNumber, mobileNumber } = form.getValues();
    const aadharResult = z.string().regex(/^\d{12}$/).safeParse(aadharNumber);
    const mobileResult = z.string().regex(/^\d{10}$/).safeParse(mobileNumber);

    if (!aadharResult.success) {
      form.setError('aadharNumber', { message: 'Please enter a valid 12-digit Aadhar number.' });
      return;
    }
     if (!mobileResult.success) {
      form.setError('mobileNumber', { message: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your mobile number.',
      });
    }, 1000);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Mock OTP verification
      if (values.otp === '123456') {
        toast({
          title: 'Verification Successful',
          description: 'Redirecting to your profile setup...',
        });
        router.push('/artisan/profile');
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
          <CardTitle className="font-headline text-3xl">Artisan Registration</CardTitle>
          <CardDescription>
            {otpSent ? 'Enter the OTP sent to your mobile.' : 'Create your artisan account.'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {!otpSent && (
                <>
                  <FormField
                    control={form.control}
                    name="aadharNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Number</FormLabel>
                        <FormControl>
                          <Input placeholder="12-digit Aadhar number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="recoveryNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recovery Mobile Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="10-digit recovery number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {otpSent && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password (OTP)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 6-digit OTP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!otpSent && (
                <div className="space-y-2">
                    <FormLabel>Terms and Conditions</FormLabel>
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
                                I agree to the terms and conditions.
                            </FormLabel>
                            <FormMessage />
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
              )}
            </CardContent>
            <CardContent>
              {otpSent ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Continue
                </Button>
              ) : (
                <Button type="button" className="w-full" onClick={form.handleSubmit(handleSendOtp)} disabled={isLoading}>
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
