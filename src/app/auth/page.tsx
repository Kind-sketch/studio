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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

const baseTerms = [
  "You agree to provide accurate and complete information during registration.",
  "You are responsible for maintaining the confidentiality of your account and password.",
  "You agree not to engage in any fraudulent or deceptive practices.",
  "We reserve the right to suspend or terminate your account for any violation of these terms.",
  "All disputes are subject to the jurisdiction of the local courts.",
];

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('buyer');
  const { language } = useLanguage();
  const [termsAndConditions, setTermsAndConditions] = useState(baseTerms);

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Welcome',
    description: 'Join as a Buyer or Sponsor',
    buyerTab: 'Buyer',
    sponsorTab: 'Sponsor',
    loginTab: 'Login',
    signUpTab: 'Sign Up',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    loginPasswordPlaceholder: '••••••••',
    registerPasswordPlaceholder: 'Create a strong password',
    loginButton: 'Login',
    createAccountButton: 'Create Account',
    termsLabel: 'Terms and Conditions',
    agreeToTermsLabel: 'I agree to the terms and conditions.',
    loginSuccessToast: 'Login Successful',
    loginSuccessToastDesc: 'Welcome back!',
    registerSuccessToast: 'Registration Successful',
    registerSuccessToastDesc: "You're all set! Welcome to Artistry Havens.",
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = [
          'Welcome', 'Join as a Buyer or Sponsor', 'Buyer', 'Sponsor',
          'Login', 'Sign Up', 'Email', 'you@example.com', 'Password',
          '••••••••', 'Create a strong password', 'Login', 'Create Account',
          'Terms and Conditions', 'I agree to the terms and conditions.',
          'Login Successful', 'Welcome back!', 'Registration Successful',
          "You're all set! Welcome to Artistry Havens.",
          ...baseTerms
        ];
        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        setTranslatedContent({
          title: translatedTexts[0],
          description: translatedTexts[1],
          buyerTab: translatedTexts[2],
          sponsorTab: translatedTexts[3],
          loginTab: translatedTexts[4],
          signUpTab: translatedTexts[5],
          emailLabel: translatedTexts[6],
          emailPlaceholder: translatedTexts[7],
          passwordLabel: translatedTexts[8],
          loginPasswordPlaceholder: translatedTexts[9],
          registerPasswordPlaceholder: translatedTexts[10],
          loginButton: translatedTexts[11],
          createAccountButton: translatedTexts[12],
          termsLabel: translatedTexts[13],
          agreeToTermsLabel: translatedTexts[14],
          loginSuccessToast: translatedTexts[15],
          loginSuccessToastDesc: translatedTexts[16],
          registerSuccessToast: translatedTexts[17],
          registerSuccessToastDesc: translatedTexts[18],
        });
        setTermsAndConditions(translatedTexts.slice(19));
      } else {
        setTermsAndConditions(baseTerms);
      }
    };
    translateContent();
  }, [language]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', agreeToTerms: false },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: translatedContent.loginSuccessToast,
        description: translatedContent.loginSuccessToastDesc,
      });
      const redirectPath = userType === 'buyer' ? '/buyer/home' : '/sponsor/dashboard';
      router.push(redirectPath);
    }, 1000);
  }

  function onRegister(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: translatedContent.registerSuccessToast,
        description: translatedContent.registerSuccessToastDesc,
      });
      const redirectPath = userType === 'buyer' ? '/buyer/home' : '/sponsor/dashboard';
      router.push(redirectPath);
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
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

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{translatedContent.loginTab}</TabsTrigger>
              <TabsTrigger value="register">{translatedContent.signUpTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4 pt-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translatedContent.emailLabel}</FormLabel>
                        <FormControl><Input placeholder={translatedContent.emailPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translatedContent.passwordLabel}</FormLabel>
                        <FormControl><Input type="password" placeholder={translatedContent.loginPasswordPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translatedContent.loginButton}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4 pt-4">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translatedContent.emailLabel}</FormLabel>
                        <FormControl><Input placeholder={translatedContent.emailPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translatedContent.passwordLabel}</FormLabel>
                        <FormControl><Input type="password" placeholder={translatedContent.registerPasswordPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                      <FormLabel>{translatedContent.termsLabel}</FormLabel>
                      <ScrollArea className="h-24 w-full rounded-md border p-3 text-sm">
                          <ul className="list-disc pl-5 space-y-1">
                              {termsAndConditions.map((term, index) => <li key={index}>{term}</li>)}
                          </ul>
                      </ScrollArea>
                      <FormField
                          control={registerForm.control}
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translatedContent.createAccountButton}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          <Button variant="link" className="text-xs p-0 h-auto">{translatedContent.termsLabel}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
