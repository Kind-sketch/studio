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

export default function MySponsorsPage() {
  const [mySponsors, setMySponsors] = useState<SponsorRequest[]>([]);
  const { toast } = useToast();

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
      title: 'Sponsorship Terminated',
      description: 'The sponsor has been removed from your list.',
    });
  };

  const handleChat = (sponsorName: string) => {
    toast({
        title: `Starting chat with ${sponsorName}`,
        description: 'Chat functionality is not yet implemented.',
    });
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold">My Sponsors</h1>
        <p className="text-sm text-muted-foreground">Manage your current sponsorships.</p>
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
                  <CardDescription>Sponsorship active</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Contribution: </span>
                  <Badge variant="secondary">₹{sponsor.contributionAmount}/month</Badge>
                </p>
                <p className="text-sm text-muted-foreground">{sponsor.message}</p>
              </CardContent>
              <CardContent className="flex gap-2">
                 <Button onClick={() => handleChat(sponsor.name)} variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <X className="mr-2 h-4 w-4" /> Terminate
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently terminate your sponsorship with {sponsor.name}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleTerminate(sponsor.id)}>Terminate</AlertDialogAction>
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
                <p className="text-lg">No current sponsors.</p>
                <p>Accepted sponsor requests will appear here.</p>
            </div>
        </Card>
      )}
    </div>
  );
}
