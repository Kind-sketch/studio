
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/context/translation-context';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.sponsor_profile_page;
  
  const [sponsor, setSponsor] = useState({
      name: 'Sponsor Name',
      avatarUrl: 'https://picsum.photos/seed/sponsor/200',
      phone: '123-456-7890'
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem('sponsorProfile');
    let data;
    if (storedProfile) {
        data = JSON.parse(storedProfile);
        setSponsor(prev => ({...prev, ...data}));
    } else {
        data = {
            name: sponsor.name,
            phone: sponsor.phone,
        };
    }
    form.reset(data);
  }, [form, sponsor.name, sponsor.phone]);


  const onSubmit = (data: ProfileFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setSponsor(prev => ({ ...prev, ...data }));
      localStorage.setItem('sponsorProfile', JSON.stringify(data));
      setIsLoading(false);
      setIsEditing(false);
      toast({
        title: t.profileUpdatedToast,
        description: t.profileUpdatedToastDesc,
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                {t.editProfileButton}
            </Button>
        )}
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={sponsor.avatarUrl} alt={sponsor.name} />
                <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="w-full pt-2">
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.fullNameLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-2xl font-bold font-headline" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <h2 className="font-headline text-3xl font-bold">{sponsor.name}</h2>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.phoneLabel}</FormLabel>
                            <FormControl>
                            <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {setIsEditing(false); form.reset({name: sponsor.name, phone: sponsor.phone})}}>{t.cancelButton}</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {t.saveButton}
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
