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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  recoveryNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit recovery number.'),
  primaryOtp: z.string().length(5, 'OTP must be 5 digits.'),
  recoveryOtp: z.string().length(5, 'OTP must be 5 digits.'),
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

export default function ArtisanRegisterRecoveryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [primaryNumber, setPrimaryNumber] = useState('');

  useEffect(() => {
    const phone = localStorage.getItem('tempPhone');
    if (phone) {
        setPrimaryNumber(phone);
        // Mock sending OTPs
        toast({
            title: 'OTPs Sent',
            description: 'OTPs have been sent to both primary and recovery numbers.',
        });
    } else {
        router.push('/artisan/register');
    }
  }, [router, toast]);

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
          title: 'Verification Successful',
          description: "Let's set up your profile.",
        });
        router.push('/artisan/category-selection');
      } else {
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Invalid OTP',
          description: 'One or both of the OTPs entered are incorrect. Please try again.',
        });
      }
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Complete Your Registration</CardTitle>
          <CardDescription>
            Enter a recovery number and verify both numbers to secure your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <div>
                    <FormLabel>Primary Number</FormLabel>
                    <Input value={primaryNumber} disabled />
                </div>
                <FormField
                    control={form.control}
                    name="primaryOtp"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>OTP for Primary Number</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter 5-digit OTP" {...field} />
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
                        <FormLabel>Recovery Mobile Number</FormLabel>
                        <FormControl>
                        <Input placeholder="10-digit recovery number" {...field} />
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
                        <FormLabel>OTP for Recovery Number</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter 5-digit OTP" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
            </CardContent>
            <CardContent>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Create Account
                </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}