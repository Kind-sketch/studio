
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
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

export default function MySponsorsPage() {
  const [mySponsors, setMySponsors] = useState<SponsorRequest[]>([]);
  const { toast } = useToast();
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: 'My Sponsors',
    description: 'Manage your current sponsorships.',
    sponsorshipActive: 'Sponsorship active',
    contribution: 'Contribution',
    chatButton: 'Chat',
    terminateButton: 'Terminate',
    noSponsorsTitle: 'No current sponsors.',
    noSponsorsDescription: 'Accepted sponsor requests will appear here.',
    terminateDialogTitle: 'Are you sure?',
    terminateDialogDescription: 'This will permanently terminate your sponsorship with {sponsorName}. This action cannot be undone.',
    cancelButton: 'Cancel',
    sponsorshipTerminatedToast: 'Sponsorship Terminated',
    sponsorshipTerminatedToastDesc: 'The sponsor has been removed from your list.',
    chatToastTitle: 'Starting chat with {sponsorName}',
    chatToastDesc: 'Chat functionality is not yet implemented.',
  });

  useEffect(() => {
    const sponsorsFromStorage = JSON.parse(localStorage.getItem('mySponsors') || '[]');
    setMySponsors(sponsorsFromStorage);
  }, []);
  
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

  const handleTerminate = (sponsorId: string) => {
    const updatedSponsors = mySponsors.filter(sponsor => sponsor.id !== sponsorId);
    localStorage.setItem('mySponsors', JSON.stringify(updatedSponsors));
    setMySponsors(updatedSponsors);

    toast({
      variant: 'destructive',
      title: translatedContent.sponsorshipTerminatedToast,
      description: translatedContent.sponsorshipTerminatedToastDesc,
    });
  };

  const handleChat = (sponsorName: string) => {
    toast({
        title: translatedContent.chatToastTitle.replace('{sponsorName}', sponsorName),
        description: translatedContent.chatToastDesc,
    });
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold">{translatedContent.title}</h1>
        <p className="text-sm text-muted-foreground">{translatedContent.description}</p>
      </header>

      {mySponsors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mySponsors.map((sponsor) => (
            <Card key={sponsor.id} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4 pb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={sponsor.avatarUrl} alt={sponsor.name} />
                  <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                  <CardDescription>{translatedContent.sponsorshipActive}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">{translatedContent.contribution}: </span>
                  <Badge variant="secondary">₹{sponsor.contributionAmount}/month</Badge>
                </p>
                <p className="text-sm text-muted-foreground">{sponsor.message}</p>
              </CardContent>
              <CardContent className="flex gap-2">
                 <Button onClick={() => handleChat(sponsor.name)} variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" /> {translatedContent.chatButton}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <X className="mr-2 h-4 w-4" /> {translatedContent.terminateButton}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{translatedContent.terminateDialogTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {translatedContent.terminateDialogDescription.replace('{sponsorName}', sponsor.name)}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{translatedContent.cancelButton}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleTerminate(sponsor.id)}>{translatedContent.terminateButton}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
         <Card className="flex items-center justify-center p-12">
            <div className="text-center text-muted-foreground">
                <p className="text-lg">{translatedContent.noSponsorsTitle}</p>
                <p>{translatedContent.noSponsorsDescription}</p>
            </div>
        </Card>
      )}
    </div>
  );
}
