
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, X } from 'lucide-react';
import type { SponsorRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from '@/context/translation-context';

export default function MySponsorsPage() {
  const [mySponsors, setMySponsors] = useState<SponsorRequest[]>([]);
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.my_sponsors_page;

  useEffect(() => {
    const sponsorsFromStorage = JSON.parse(localStorage.getItem('mySponsors') || '[]');
    setMySponsors(sponsorsFromStorage);
  }, []);
  
  const handleTerminate = (sponsorId: string) => {
    const updatedSponsors = mySponsors.filter(sponsor => sponsor.id !== sponsorId);
    localStorage.setItem('mySponsors', JSON.stringify(updatedSponsors));
    setMySponsors(updatedSponsors);

    toast({
      variant: 'destructive',
      title: t.sponsorshipTerminatedToast,
      description: t.sponsorshipTerminatedToastDesc,
    });
  };

  const handleChat = (sponsorName: string) => {
    toast({
        title: t.chatToastTitle.replace('{sponsorName}', sponsorName),
        description: t.chatToastDesc,
    });
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 mt-12">
        <h1 className="font-headline text-3xl font-bold">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </header>

      {mySponsors.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {mySponsors.map((sponsor) => (
            <Card key={sponsor.id} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4 pb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={sponsor.avatarUrl} alt={sponsor.name} />
                  <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                  <CardDescription>{t.sponsorshipActive}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">{t.contribution}: </span>
                  <Badge variant="secondary">₹{sponsor.contributionAmount}/month</Badge>
                </p>
                <p className="text-sm text-muted-foreground">{sponsor.message}</p>
              </CardContent>
              <CardContent className="flex flex-col gap-2">
                 <Button onClick={() => handleChat(sponsor.name)} variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" /> {t.chatButton}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <X className="mr-2 h-4 w-4" /> {t.terminateButton}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.terminateDialogTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.terminateDialogDescription.replace('{sponsorName}', sponsor.name)}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.cancelButton}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleTerminate(sponsor.id)}>{t.terminateButton}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
         <Card className="flex items-center justify-center p-12 mt-4">
            <div className="text-center text-muted-foreground">
                <p className="text-lg">{t.noSponsorsTitle}</p>
                <p>{t.noSponsorsDescription}</p>
            </div>
        </Card>
      )}
    </div>
  );
}
