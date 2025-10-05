
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, Users, HandCoins } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Welcome back, Artisan!</h1>
        <p className="text-muted-foreground">Here's a snapshot of your creative haven.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        
        <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            className="w-full lg:col-span-1"
        >
            <CarouselContent>
                <CarouselItem>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Revenue</CardTitle>
                        <HandCoins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹3,731.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                    </Card>
                </CarouselItem>
                <CarouselItem>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shared with Sponsors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹165.00</div>
                        <p className="text-xs text-muted-foreground">From 2 active sponsorships</p>
                    </CardContent>
                    </Card>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2" />
        </Carousel>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Shared with Sponsors</CardTitle>
            <CardDescription>
              Revenue shared with sponsors from your successful sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Sponsor's Share</TableHead>
                  <TableHead className="text-right">Shared Amount</TableHead>
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
