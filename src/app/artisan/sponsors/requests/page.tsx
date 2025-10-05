'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SponsorRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

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
  const [sponsorRequests, setSponsorRequests] = useState<SponsorRequest[]>(initialSponsorRequests);
  const { toast } = useToast();
  const router = useRouter();

  const handleAccept = (sponsorId: string) => {
    const sponsorToMove = sponsorRequests.find(req => req.id === sponsorId);
    
    if (sponsorToMove) {
        const mySponsors = JSON.parse(localStorage.getItem('mySponsors') || '[]');
        localStorage.setItem('mySponsors', JSON.stringify([...mySponsors, sponsorToMove]));
    }

    setSponsorRequests(prev => prev.filter(req => req.id !== sponsorId));
    toast({
      title: 'Sponsor Accepted',
      description: 'The sponsor has been added to "My Sponsors".',
    });
    router.push('/artisan/sponsors/my-sponsors');
  };

  const handleDecline = (sponsorId: string) => {
    setSponsorRequests(prev => prev.filter(req => req.id !== sponsorId));
    toast({
      variant: 'destructive',
      title: 'Sponsor Declined',
      description: 'The sponsor request has been removed.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Sponsor Requests</h1>
        <p className="text-muted-foreground">Review and manage incoming sponsorship offers.</p>
      </header>

      {sponsorRequests.length > 0 ? (
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
                        Offering <Badge variant="secondary">₹{request.contributionAmount}/month</Badge>
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"{request.message}"</p>
              </CardContent>
              <CardContent className="flex gap-2">
                <Button onClick={() => handleAccept(request.id)} className="w-full">
                  <Check className="mr-2 h-4 w-4" /> Accept
                </Button>
                <Button onClick={() => handleDecline(request.id)} variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" /> Decline
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex items-center justify-center p-12">
            <div className="text-center text-muted-foreground">
                <p className="text-lg">No new sponsor requests.</p>
                <p>Share your work to attract sponsors!</p>
            </div>
        </Card>
      )}
    </div>
  );
}
