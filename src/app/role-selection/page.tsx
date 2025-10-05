
'use client';

import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Palette, ShoppingBag, HeartHandshake } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useState, useEffect } from 'react';

const baseRoles = [
  {
    name: 'Artisan',
    description: 'Showcase your creations, connect with buyers.',
    href: '/artisan/register',
    icon: Palette,
  },
  {
    name: 'Buyer',
    description: 'Discover and purchase unique handmade goods.',
    href: '/auth',
    icon: ShoppingBag,
  },
  {
    name: 'Sponsor',
    description: 'Support artisans and the creative community.',
    href: '/auth',
    icon: HeartHandshake,
  },
];

export default function RoleSelectionPage() {
  const { language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    welcome: 'Welcome to Artistry Havens',
    joinCommunity: 'How would you like to join our community?',
    artisanPrefix: 'I am an',
    buyerPrefix: 'I am a',
    sponsorPrefix: 'I am a',
    footer: 'For artisans, the first step will be to register.',
  });
  const [roles, setRoles] = useState(baseRoles);

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = [
          'Welcome to Artistry Havens',
          'How would you like to join our community?',
          'I am an',
          'I am a',
          'I am a',
          'For artisans, the first step will be to register.',
          ...baseRoles.map(r => r.name),
          ...baseRoles.map(r => r.description),
        ];

        const { translatedTexts } = await translateText({
          texts: textsToTranslate,
          targetLanguage: language,
        });

        setTranslatedContent({
          welcome: translatedTexts[0],
          joinCommunity: translatedTexts[1],
          artisanPrefix: translatedTexts[2],
          buyerPrefix: translatedTexts[3],
          sponsorPrefix: translatedTexts[4],
          footer: translatedTexts[5],
        });

        const translatedRoles = baseRoles.map((role, index) => ({
          ...role,
          name: translatedTexts[6 + index],
          description: translatedTexts[6 + baseRoles.length + index],
        }));
        setRoles(translatedRoles);
      } else {
        setTranslatedContent({
            welcome: 'Welcome to Artistry Havens',
            joinCommunity: 'How would you like to join our community?',
            artisanPrefix: 'I am an',
            buyerPrefix: 'I am a',
            sponsorPrefix: 'I am a',
            footer: 'For artisans, the first step will be to register.',
        });
        setRoles(baseRoles);
      }
    };
    translateContent();
  }, [language]);

  const getPrefix = (roleIndex: number) => {
    // We use the index to reliably know which original role we're dealing with
    const originalRoleName = baseRoles[roleIndex].name;
    switch (originalRoleName) {
        case 'Artisan': return translatedContent.artisanPrefix;
        case 'Buyer': return translatedContent.buyerPrefix;
        case 'Sponsor': return translatedContent.sponsorPrefix;
        default: return translatedContent.buyerPrefix;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-xs text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-xl font-bold">
            {translatedContent.welcome}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {translatedContent.joinCommunity}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {roles.map((role, index) => (
            <Link href={role.href} key={role.name} passHref>
              <Card className="transform-gpu cursor-pointer text-left transition-transform hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <role.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="font-headline text-base">
                      {getPrefix(index)} {role.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {role.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          {translatedContent.footer}
        </p>
      </div>
    </div>
  );
}
