
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, Users, HandCoins } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { translateText } from "@/services/translation-service";
import { useState, useEffect } from 'react';

const sponsoredProducts = [
  {
    ...products[0],
    sponsor: { name: 'CreativeFund' },
    sharedAmount: 75,
    sponsorShare: '15%',
  },
  {
    ...products[2],
    sponsor: { name: 'ArtLover22' },
    sharedAmount: 90,
    sponsorShare: '20%',
  },
];


export default function ArtisanDashboard() {
  const { language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    welcome: 'Welcome back, Artisan!',
    snapshot: "Here's a snapshot of your creative haven.",
    revenue: 'Your Revenue',
    fromLastMonth: '+20.1% from last month',
    sharedWithSponsors: 'Shared with Sponsors',
    fromSponsorships: 'From 2 active sponsorships',
    totalSales: 'Total Sales',
    totalSalesStat: '+180.1% from last month',
    totalLikes: 'Total Likes',
    totalLikesStat: '+19% from last month',
    sharedTableTitle: 'Shared with Sponsors',
    sharedTableDescription: 'Revenue shared with sponsors from your successful sales.',
    productHeader: 'Product',
    sponsorHeader: 'Sponsor',
    sponsorShareHeader: "Sponsor's Share",
    sharedAmountHeader: 'Shared Amount',
  });

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
  
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold">{translatedContent.welcome}</h1>
        <p className="text-sm text-muted-foreground">{translatedContent.snapshot}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        
        <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            className="w-full lg:col-span-1"
        >
            <CarouselContent>
                <CarouselItem>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{translatedContent.revenue}</CardTitle>
                        <HandCoins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹3,731.89</div>
                        <p className="text-xs text-muted-foreground">{translatedContent.fromLastMonth}</p>
                    </CardContent>
                    </Card>
                </CarouselItem>
                <CarouselItem>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{translatedContent.sharedWithSponsors}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹165.00</div>
                        <p className="text-xs text-muted-foreground">{translatedContent.fromSponsorships}</p>
                    </CardContent>
                    </Card>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
        </Carousel>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translatedContent.totalSales}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">{translatedContent.totalSalesStat}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translatedContent.totalLikes}</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">{translatedContent.totalLikesStat}</p>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>{translatedContent.sharedTableTitle}</CardTitle>
            <CardDescription>
             {translatedContent.sharedTableDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] sm:w-[100px]">{translatedContent.productHeader}</TableHead>
                  <TableHead>{translatedContent.sponsorHeader}</TableHead>
                  <TableHead>{translatedContent.sponsorShareHeader}</TableHead>
                  <TableHead className="text-right">{translatedContent.sharedAmountHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsoredProducts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                       <Image
                        src={item.image.url}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover aspect-square"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.sponsor.name}</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{item.sponsorShare}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{item.sharedAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

    </div>
  )
}

    