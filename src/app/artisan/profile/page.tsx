
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save, Star, Eye, EyeOff, Mic } from 'lucide-react';
import { artisans } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/context/translation-context';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import 'regenerator-runtime/runtime';
import TutorialDialog from '@/components/tutorial-dialog';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  companyName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type ProfileField = 'name' | 'companyName' | 'address' | 'phone';

function ProfilePageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetupMode = searchParams.get('setup') === 'true';

  const [isEditing, setIsEditing] = useState(isSetupMode);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { translations } = useTranslation();
  const { language } = useLanguage();
  const t = translations.profile_page;
  
  const [artisan, setArtisan] = useState({
      ...artisans[0],
      companyName: 'Elena\'s Ceramics',
      rating: 4.8,
      address: '123 Clay Street, Pottery Town, 45678',
      phone: '987-654-3210'
  });
  
  const [isListening, setIsListening] = useState(false);
  const [targetField, setTargetField] = useState<ProfileField | null>(null);
  const recognitionRef = useRef<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      companyName: '',
      address: '',
      phone: '',
    },
  });
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTargetField(null);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Voice Error',
          description: 'Could not recognize your voice. Please try again.',
        });
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (targetField) {
          form.setValue(targetField, transcript);
        }
      };
    }
  }, [language, form, toast, targetField]);
  
  const handleMicClick = (field: ProfileField) => {
    if (!recognitionRef.current) {
      toast({ variant: 'destructive', title: 'Not Supported', description: 'Voice input is not supported on this browser.' });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTargetField(field);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    const storedProfile = localStorage.getItem('artisanProfile');
    let data;
    if (storedProfile) {
        data = JSON.parse(storedProfile);
        setArtisan(prev => ({...prev, ...data}));
    } else {
        const tempPhone = isSetupMode ? localStorage.getItem('tempPhone') : null;
        data = {
            name: artisan.name,
            companyName: artisan.companyName,
            address: artisan.address,
            phone: tempPhone || artisan.phone,
        };
    }
    form.reset(data);
  }, [form, artisan.name, artisan.companyName, artisan.address, artisan.phone, isSetupMode]);


  const onSubmit = (data: ProfileFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setArtisan(prev => ({ ...prev, ...data }));
      localStorage.setItem('artisanProfile', JSON.stringify(data));
      setIsLoading(false);
      setIsEditing(false);
      toast({
        title: t.profileUpdatedToast,
        description: t.profileUpdatedToastDesc,
      });

      if (isSetupMode) {
        router.push('/artisan/category-selection');
      }
    }, 1000);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-6 w-6 ${
            i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };
  
  const renderVoiceInput = (field: ProfileField) => {
    if (language === 'en' || !isEditing) return null;
    return (
       <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleMicClick(field)}
          className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8", 
              isListening && targetField === field && "bg-destructive text-destructive-foreground animate-pulse"
          )}
        >
          <Mic className="h-4 w-4" />
        </Button>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl relative mt-12">
        <div className="mb-4 flex justify-between items-center">
            <TutorialDialog pageId="profile" />
            {!isEditing && !isSetupMode && (
                <Button onClick={() => setIsEditing(true)} size="sm" className="bg-yellow-300 text-yellow-900 hover:bg-yellow-400">
                    <Edit className="mr-2 h-4 w-4" />
                    {t.editProfileButton}
                </Button>
            )}
        </div>
      <header className="mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">{isSetupMode ? t.setupTitle : t.title}</h1>
          <p className="text-muted-foreground">{isSetupMode ? t.setupDescription : t.description}</p>
        </div>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={artisan.avatar.url} alt={artisan.name} />
                <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="w-full">
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.fullNameLabel}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} className="text-2xl font-bold font-headline pr-10" />
                            {renderVoiceInput('name')}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <h2 className="font-headline text-3xl font-bold">{artisan.name}</h2>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">{renderStars(artisan.rating)}</div>
                  <span className="text-muted-foreground font-bold">{artisan.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
                <Separator />
                
                <div>
                    <h3 className="font-headline text-xl font-semibold">{t.professionalDetailsTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1"><Eye className="h-4 w-4"/>{t.visibleToAll}</p>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.companyNameLabel}</FormLabel>
                                <FormControl>
                                <div className="relative">
                                  <Input {...field} disabled={!isEditing} className="pr-10" />
                                  {renderVoiceInput('companyName')}
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="font-headline text-xl font-semibold">{t.personalDetailsTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1"><EyeOff className="h-4 w-4"/>{t.visibleToSponsors}</p>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.addressLabel}</FormLabel>
                                <FormControl>
                                <div className="relative">
                                  <Input {...field} disabled={!isEditing} className="pr-10"/>
                                  {renderVoiceInput('address')}
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.phoneLabel}</FormLabel>
                                <FormControl>
                                <div className="relative">
                                  <Input {...field} disabled={!isEditing || isSetupMode} className="pr-10" />
                                  {renderVoiceInput('phone')}
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </div>

                {isEditing && (
                <div className="flex justify-end gap-2">
                  {!isSetupMode && <Button variant="outline" onClick={() => {setIsEditing(false); form.reset({name: artisan.name, companyName: artisan.companyName, address: artisan.address, phone: artisan.phone})}}>{t.cancelButton}</Button>}
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSetupMode ? t.setupSaveButton : t.saveButton}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageComponent />
    </Suspense>
  )
}

      