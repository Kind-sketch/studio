'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";
import Image from "next/image";

// Mock data for sponsored products and revenue
const myRevenueData = [
  {
    ...products[0],
    revenue: 450,
  },
  {
    ...products[3],
    revenue: 1200,
  },
  {
    ...products[4],
    revenue: 750,
  },
];

const sharedRevenueData = [
  {
    ...products[1],
    sharedAmount: 225,
    artisanShare: '15%',
  },
  {
    ...products[2],
    sharedAmount: 180,
    artisanShare: '20%',
  },
];


export default function RevenuePage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Revenue Generated</h1>
        <p className="text-lg text-muted-foreground">Track your sponsorship returns.</p>
      </header>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>My Revenue</CardTitle>
            <CardDescription>
              Direct revenue generated for you from sponsored products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRevenueData.map((item) => (
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
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-semibold">₹{item.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shared Revenue</CardTitle>
            <CardDescription>
              Profit shared with artisans from successful sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Artisan's Share</TableHead>
                  <TableHead className="text-right">Shared Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedRevenueData.map((item) => (
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
                    <TableCell className="font-medium">{item.artisan.name}</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{item.artisanShare}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{item.sharedAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
