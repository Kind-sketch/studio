
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, Users, HandCoins } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/context/translation-context";
import TutorialDialog from "@/components/tutorial-dialog";

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
  const { translations } = useTranslation();
  const t = translations.artisan_dashboard;
  
  return (
    <div className="container mx-auto p-2 sm:p-4 relative">
      <TutorialDialog pageId="dashboard" />
      <header className="mb-6 mt-12">
        <h1 className="font-headline text-2xl font-bold">{t.welcome}</h1>
        <p className="text-sm text-muted-foreground">{t.snapshot}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        
        <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            className="w-full"
        >
            <CarouselContent>
                <CarouselItem>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.revenue}</CardTitle>
                        <HandCoins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹3,731.89</div>
                        <p className="text-xs text-muted-foreground">{t.fromLastMonth}</p>
                    </CardContent>
                    </Card>
                </CarouselItem>
                <CarouselItem>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.sharedWithSponsors}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹165.00</div>
                        <p className="text-xs text-muted-foreground">{t.fromSponsorships}</p>
                    </CardContent>
                    </Card>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 hidden sm:flex" />
        </Carousel>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalSales}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">{t.totalSalesStat}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalLikes}</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">{t.totalLikesStat}</p>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>{t.sharedTableTitle}</CardTitle>
            <CardDescription>
             {t.sharedTableDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] hidden sm:table-cell">{t.productHeader}</TableHead>
                    <TableHead>{t.sponsorHeader}</TableHead>
                    <TableHead>{t.sponsorShareHeader}</TableHead>
                    <TableHead className="text-right">{t.sharedAmountHeader}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsoredProducts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="hidden sm:table-cell">
                         <Image
                          src={item.image.url}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover aspect-square"
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div>
                            <p>{item.sponsor.name}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{item.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                          <Badge variant="secondary">{item.sponsorShare}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">₹{item.sharedAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

    </div>
  )
}
