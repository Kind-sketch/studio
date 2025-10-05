import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { languages } from '@/lib/data';
import { Logo } from '@/components/icons';

export default function LanguageSelectionPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
            <Logo className="mb-2 h-12 w-12 text-primary"/>
          <CardTitle className="font-headline text-3xl">
            Choose Your Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant="outline"
                className="h-14 justify-start text-base"
                asChild
              >
                <Link href="/role-selection">
                  <div className="flex w-full items-center justify-between">
                    <span>{lang.name}</span>
                    <span className="text-muted-foreground">{lang.nativeName}</span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
