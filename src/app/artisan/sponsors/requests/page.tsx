
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import type { SponsorRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/context/translation-context';

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

export default function SponsorRequestsPage() {
  const [sponsorRequests, setSponsorRequests] = useState<SponsorRequest[]>([]);
  const [mySponsors, setMySponsors] = useState<SponsorRequest[]>([]);
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.sponsor_requests_page;

  useEffect(() => {
    const sponsorsFromStorage = JSON.parse(localStorage.getItem('mySponsors') || '[]');
    setMySponsors(sponsorsFromStorage);

    const requestsFromStorage = localStorage.getItem('sponsorRequests');
    if (requestsFromStorage) {
        setSponsorRequests(JSON.parse(requestsFromStorage));
    } else {
        setSponsorRequests(initialSponsorRequests);
        localStorage.setItem('sponsorRequests', JSON.stringify(initialSponsorRequests));
    }
  }, []);

  const handleAccept = (sponsorId: string) => {
    const sponsorToMove = sponsorRequests.find(req => req.id === sponsorId);
    
    if (sponsorToMove) {
        const updatedMySponsors = [...mySponsors, sponsorToMove];
        localStorage.setItem('mySponsors', JSON.stringify(updatedMySponsors));
        setMySponsors(updatedMySponsors);
    }
    
    const updatedRequests = sponsorRequests.filter(req => req.id !== sponsorId)
    setSponsorRequests(updatedRequests);
    localStorage.setItem('sponsorRequests', JSON.stringify(updatedRequests));

    toast({
      title: t.sponsorAcceptedToast,
      description: t.sponsorAcceptedToastDesc,
    });
  };

  const handleDecline = (sponsorId: string) => {
    const updatedRequests = sponsorRequests.filter(req => req.id !== sponsorId);
    setSponsorRequests(updatedRequests);
    localStorage.setItem('sponsorRequests', JSON.stringify(updatedRequests));
    toast({
      variant: 'destructive',
      title: t.sponsorDeclinedToast,
      description: t.sponsorDeclinedToastDesc,
    });
  };


  const renderRequests = () => {
      if (sponsorRequests.length === 0) {
        return (
            <Card className="flex items-center justify-center p-12">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg">{t.noRequestsTitle}</p>
                    <p>{t.noRequestsDescription}</p>
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
                        {t.offering} <Badge variant="secondary">₹{request.contributionAmount}/month</Badge>
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"{request.message}"</p>
              </CardContent>
              <CardContent className="flex gap-2">
                <Button onClick={() => handleAccept(request.id)} className="w-full">
                  <Check className="mr-2 h-4 w-4" /> {t.acceptButton}
                </Button>
                <Button onClick={() => handleDecline(request.id)} variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" /> {t.declineButton}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </header>
        {renderRequests()}
    </div>
  );
}
