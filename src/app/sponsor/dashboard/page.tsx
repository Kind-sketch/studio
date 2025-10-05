import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";

export default function SponsorDashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <div className="inline-block rounded-full bg-primary/10 p-4">
          <Logo className="h-16 w-16 text-primary" />
        </div>
        <h1 className="mt-4 font-headline text-4xl font-bold">Sponsor Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Thank you for supporting our artisans.</p>
      </header>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>We are building a dedicated space for our sponsors.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This area will soon feature opportunities to connect with artisans, view the impact of your contributions, and discover new talents to support. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
