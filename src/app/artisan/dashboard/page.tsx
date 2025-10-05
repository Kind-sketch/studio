
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, Users, HandCoins } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function ArtisanDashboard() {
  const recentSales = products.slice(0, 3);
  
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
            className="w-full"
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
                        <div className="text-2xl font-bold">₹500.00</div>
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

      <div className="grid gap-8">
        <div className="">
          <Card>
            <CardHeader>
              <CardTitle>Product Breakdown</CardTitle>
              <CardDescription>A quick look at your top performers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map(product => (
                  <div key={product.id} className="flex items-center gap-4 rounded-lg border p-3 text-sm">
                     <Image src={product.image.url} alt={product.name} width={48} height={48} className="rounded-md object-cover aspect-square bg-muted"/>
                     <div className="flex-1 grid grid-cols-3 items-center gap-2">
                       <p className="font-medium truncate col-span-2">{product.name}</p>
                       <div className="text-right">
                          <p className="font-semibold">₹{product.price.toFixed(2)}</p>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="">
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with your next masterpiece.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/artisan/orders"><PlusCircle className="mr-2 h-4 w-4"/> Add New Product</Link>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <Link href="/artisan/trends">View Market Trends</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
