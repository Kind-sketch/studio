
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Check, X, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SponsorRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const initialSponsorRequests: SponsorRequest[] = [
    {
      id: 'sponsor-1',
      name: 'ArtLover22',
      avatarUrl: 'https://picsum.photos/seed/sponsor1/100/100',
      contributionAmount: 50,
      message: 'Love your work! Would be honored to support your journey.',
    },
    {
      id: 'sponsor-2',
      name: 'CreativeFund',
      avatarUrl: 'https://picsum.photos/seed/sponsor2/100/100',
      contributionAmount: 100,
      message: 'We support emerging artists. Your portfolio is impressive.',
    },
];

export default function SponsorsPage() {
  const [sponsorRequests, setSponsorRequests] = useState<SponsorRequest[]>([]);
  const [mySponsors, setMySponsors] = useState<SponsorRequest[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Manage Sponsors',
    description: 'Review sponsorship offers and manage current partners.',
    requestsTab: 'Sponsor Requests',
    mySponsorsTab: 'My Sponsors',
    offering: 'Offering',
    acceptButton: 'Accept',
    declineButton: 'Decline',
    noRequestsTitle: 'No new sponsor requests.',
    noRequestsDescription: 'Share your work to attract sponsors!',
    sponsorshipActive: 'Sponsorship active',
    contribution: 'Contribution',
    chatButton: 'Chat',
    terminateButton: 'Terminate',
    noSponsorsTitle: 'No current sponsors.',
    noSponsorsDescription: 'Accepted sponsor requests will appear here.',
    terminateDialogTitle: 'Are you sure?',
    terminateDialogDescription: 'This will permanently terminate your sponsorship with {sponsorName}. This action cannot be undone.',
    cancelButton: 'Cancel',
    sponsorAcceptedToast: 'Sponsor Accepted',
    sponsorAcceptedToastDesc: 'The sponsor has been added to "My Sponsors".',
    sponsorDeclinedToast: 'Sponsor Declined',
    sponsorDeclinedToastDesc: 'The sponsor request has been removed.',
    sponsorshipTerminatedToast: 'Sponsorship Terminated',
    sponsorshipTerminatedToastDesc: 'The sponsor has been removed from your list.',
    chatToastTitle: 'Starting chat with {sponsorName}',
    chatToastDesc: 'Chat functionality is not yet implemented.',
  });

  useEffect(() => {
    const sponsorsFromStorage = JSON.parse(localStorage.getItem('mySponsors') || '[]');
    setMySponsors(sponsorsFromStorage);

    const requestsFromStorage = JSON.parse(localStorage.getItem('sponsorRequests'));
    if (requestsFromStorage) {
        setSponsorRequests(requestsFromStorage);
    } else {
        setSponsorRequests(initialSponsorRequests);
        localStorage.setItem('sponsorRequests', JSON.stringify(initialSponsorRequests));
    }
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


  const handleAccept = (sponsorId: string) => {
    const sponsorToMove = sponsorRequests.find(req => req.id === sponsorId);
    
    if (sponsorToMove) {
        const updatedMySponsors = [...mySponsors, sponsorToMove];
        localStorage.setItem('mySponsors', JSON.stringify(updatedMySponsors));
        setMySponsors(updatedMySponsors);
    }
    
    const updatedRequests = sponsorRequests.filter(req => req.id !== sponsorId);
    setSponsorRequests(updatedRequests);
    localStorage.setItem('sponsorRequests', JSON.stringify(updatedRequests));

    toast({
      title: translatedContent.sponsorAcceptedToast,
      description: translatedContent.sponsorAcceptedToastDesc,
    });
  };

  const handleDecline = (sponsorId: string) => {
    const updatedRequests = sponsorRequests.filter(req => req.id !== sponsorId)
    setSponsorRequests(updatedRequests);
    localStorage.setItem('sponsorRequests', JSON.stringify(updatedRequests));
    toast({
      variant: 'destructive',
      title: translatedContent.sponsorDeclinedToast,
      description: translatedContent.sponsorDeclinedToastDesc,
    });
  };

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

  const renderRequests = () => {
      if (sponsorRequests.length === 0) {
        return (
            <Card className="flex items-center justify-center p-12">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg">{translatedContent.noRequestsTitle}</p>
                    <p>{translatedContent.noRequestsDescription}</p>
                </div>
            </Card>
        )
      }

      return (
        <div className="space-y-4">
          {sponsorRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="flex-row items-center gap-4 pb-4">
                 <Avatar className="h-12 w-12">
                  <AvatarImage src={request.avatarUrl} alt={request.name} />
                  <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg">{request.name}</CardTitle>
                    <CardDescription>
                        {translatedContent.offering} <Badge variant="secondary">₹{request.contributionAmount}/month</Badge>
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"{request.message}"</p>
              </CardContent>
              <CardContent className="flex gap-2">
                <Button onClick={() => handleAccept(request.id)} className="w-full">
                  <Check className="mr-2 h-4 w-4" /> {translatedContent.acceptButton}
                </Button>
                <Button onClick={() => handleDecline(request.id)} variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" /> {translatedContent.declineButton}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
  }

  const renderMySponsors = () => {
    if (mySponsors.length === 0) {
        return (
            <Card className="flex items-center justify-center p-12">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg">{translatedContent.noSponsorsTitle}</p>
                    <p>{translatedContent.noSponsorsDescription}</p>
                </div>
            </Card>
        )
      }

      return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
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
              <CardContent className="flex flex-col gap-2">
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
      );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </header>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">{translatedContent.requestsTab}</TabsTrigger>
          <TabsTrigger value="my-sponsors">{translatedContent.mySponsorsTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          {renderRequests()}
        </TabsContent>
        <TabsContent value="my-sponsors">
          {renderMySponsors()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
