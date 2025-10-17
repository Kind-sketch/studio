
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult, PhoneAuthProvider, linkWithCredential, PhoneAuthCredential } from 'firebase/auth';

const formSchema = z.object({
  recoveryNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit recovery number.'),
  recoveryOtp: z.string().length(6, 'OTP must be 6 digits.'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

const baseTerms = [
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
  const { language } = useLanguage();
  const [termsAndConditions, setTermsAndConditions] = useState(baseTerms);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const auth = getAuth();
  
  useEffect(() => {
    // This effect is to handle cleanup of the reCAPTCHA verifier
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);


  const [translatedContent, setTranslatedContent] = useState({
      title: 'Complete Your Registration',
      description: 'Add a recovery number to secure your account.',
      primaryNumberLabel: 'Primary Number',
      recoveryNumberLabel: 'Recovery Mobile Number',
      recoveryNumberPlaceholder: '10-digit recovery number',
      sendOtpButton: 'Send OTP to Recovery Number',
      recoveryOtpLabel: 'OTP for Recovery Number',
      otpPlaceholder: 'Enter 6-digit OTP',
      termsLabel: 'Terms and Conditions',
      agreeToTermsLabel: 'I agree to the terms and conditions.',
      verifyButton: 'Link Recovery Number & Create Account',
      otpSentToast: 'OTP Sent',
      otpSentToastDesc: 'An OTP has been sent to your recovery number.',
      verificationSuccessToast: 'Account Created!',
      verificationSuccessToastDesc: "Let's get you started.",
      invalidOtpToast: 'Invalid OTP',
      invalidOtpToastDesc: 'The OTP you entered is incorrect. Please try again.',
  });

  useEffect(() => {
    const phone = localStorage.getItem('tempPhone');
    if (phone) {
        setPrimaryNumber(phone);
    } else {
        // Redirect if primary number is not found, as it's required.
        router.push('/artisan/register');
    }
  }, [router]);

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = Object.values(translatedContent).flat();
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        
        let i = 0;
        const newContent: any = {
            title: translatedTexts[i++],
            description: translatedTexts[i++],
            primaryNumberLabel: translatedTexts[i++],
            recoveryNumberLabel: translatedTexts[i++],
            recoveryNumberPlaceholder: translatedTexts[i++],
            sendOtpButton: translatedTexts[i++],
            recoveryOtpLabel: translatedTexts[i++],
            otpPlaceholder: translatedTexts[i++],
            termsLabel: translatedTexts[i++],
            agreeToTermsLabel: translatedTexts[i++],
            verifyButton: translatedTexts[i++],
            otpSentToast: translatedTexts[i++],
            otpSentToastDesc: translatedTexts[i++],
            verificationSuccessToast: translatedTexts[i++],
            verificationSuccessToastDesc: translatedTexts[i++],
            invalidOtpToast: translatedTexts[i++],
            invalidOtpToastDesc: translatedTexts[i++],
        };
        setTranslatedContent(newContent);
        setTermsAndConditions(baseTerms); // Assuming terms are not translated for now
      } else {
        setTermsAndConditions(baseTerms);
      }
    };
    translateContent();
  }, [language]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryNumber: '',
      recoveryOtp: '',
      agreeToTerms: false,
    },
  });

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {},
        'expired-callback': () => {}
      });
    }
  }

  async function handleSendOtp() {
    const { recoveryNumber } = form.getValues();
    const recoveryResult = z.string().regex(/^\d{10}$/).safeParse(recoveryNumber);
    if (!recoveryResult.success) {
      form.setError('recoveryNumber', { message: 'Please enter a valid 10-digit recovery number.' });
      return;
    }

    setIsLoading(true);
    try {
      onCaptchaVerify();
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = `+91${recoveryNumber}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      setConfirmationResult(result);
      setOtpSent(true);
      toast({
        title: translatedContent.otpSentToast,
        description: translatedContent.otpSentToastDesc,
      });
    } catch (error: any) {
      console.error("OTP sending error:", error);
      toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!confirmationResult) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please send an OTP first.' });
        return;
    }
    
    setIsLoading(true);
    try {
        const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, values.recoveryOtp);
        const currentUser = auth.currentUser;

        if (currentUser) {
            await linkWithCredential(currentUser, credential);
            
            // In a real app, you would save the primary and recovery numbers to your database here.
            localStorage.removeItem('tempPhone');

            toast({
              title: translatedContent.verificationSuccessToast,
              description: translatedContent.verificationSuccessToastDesc,
            });
            router.push('/artisan/category-selection');
        } else {
             throw new Error("No primary user found to link account.");
        }

    } catch (error: any) {
      setIsLoading(false);
      console.error("Recovery linking error:", error);
      toast({
        variant: 'destructive',
        title: translatedContent.invalidOtpToast,
        description: error.message || translatedContent.invalidOtpToastDesc,
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div id="recaptcha-container"></div>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
          <CardDescription>
            {translatedContent.description}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <div>
                    <FormLabel>{translatedContent.primaryNumberLabel}</FormLabel>
                    <Input value={primaryNumber} disabled />
                </div>
                <FormField
                    control={form.control}
                    name="recoveryNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{translatedContent.recoveryNumberLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={translatedContent.recoveryNumberPlaceholder} {...field} disabled={otpSent} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 {otpSent && <FormField
                    control={form.control}
                    name="recoveryOtp"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{translatedContent.recoveryOtpLabel}</FormLabel>
                        <FormControl>
                        <Input placeholder={translatedContent.otpPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />}
                 <div className="space-y-2">
                    <FormLabel>{translatedContent.termsLabel}</FormLabel>
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
                                {translatedContent.agreeToTermsLabel}
                            </FormLabel>
                            <FormMessage />
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
            </CardContent>
            <CardContent>
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
            </CardContent>
          </form>
        </Form>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          <Button variant="link" className="text-xs p-0 h-auto">{translatedContent.termsLabel}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
