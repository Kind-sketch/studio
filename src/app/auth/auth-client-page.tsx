
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';

const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  otp: z.string().min(5, 'OTP must be 5 digits.').optional(),
});

export default function AuthClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('buyer');
  const [otpSent, setOtpSent] = useState(false);
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Welcome',
    description: 'Join as a Buyer or Sponsor',
    buyerTab: 'Buyer',
    sponsorTab: 'Sponsor',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: '10-digit mobile number',
    sendOtpButton: 'Send OTP',
    otpLabel: 'One-Time Password (OTP)',
    otpPlaceholder: 'Enter 5-digit OTP',
    verifyButton: 'Verify & Login',
    loginSuccessToast: 'Login Successful',
    loginSuccessToastDesc: 'Welcome back!',
    invalidOtpToast: 'Invalid OTP',
    invalidOtpToastDesc: 'The OTP you entered is incorrect.',
    termsAndConditions: 'Terms & Conditions',
  });

  useEffect(() => {
    const translate = async () => {
      if (language !== 'en') {
        const values = Object.values(translatedContent);
        const { translatedTexts } = await translateText({ texts: values, targetLanguage: language });
        const newContent: any = {};
        Object.keys(translatedContent).forEach((key, index) => {
          newContent[key] = translatedTexts[index];
        });
        setTranslatedContent(newContent);
      }
    };
    translate();
  }, [language]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { mobileNumber: '', otp: '' },
  });

  function handleSendOtp() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your mobile number.',
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
        title: translatedContent.loginSuccessToast,
        description: translatedContent.loginSuccessToastDesc,
      });
      const redirectPath = userType === 'buyer' ? '/buyer/home' : '/sponsor/dashboard';
      router.push(redirectPath);
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-xs shadow-lg">
        <CardHeader className="text-center">
          <Link href="/role-selection" className="flex justify-center mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </Link>
          <CardTitle className="font-headline text-2xl">{translatedContent.title}</CardTitle>
          <CardDescription>
            {translatedContent.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buyer" onValueChange={setUserType} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer">{translatedContent.buyerTab}</TabsTrigger>
              <TabsTrigger value="sponsor">{translatedContent.sponsorTab}</TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translatedContent.mobileLabel}</FormLabel>
                    <FormControl><Input placeholder={translatedContent.mobilePlaceholder} {...field} disabled={otpSent} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {otpSent && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translatedContent.otpLabel}</FormLabel>
                      <FormControl><Input placeholder={translatedContent.otpPlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {otpSent ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translatedContent.verifyButton}
                </Button>
              ) : (
                <Button type="button" onClick={handleSendOtp} className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translatedContent.sendOtpButton}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          <Button variant="link" className="text-xs p-0 h-auto">{translatedContent.termsAndConditions}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
