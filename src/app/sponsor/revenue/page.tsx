'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";
import Image from "next/image";
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useState, useEffect } from 'react';

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
    const { language } = useLanguage();
    const [translatedContent, setTranslatedContent] = useState({
        mainTitle: 'Revenue Generated',
        mainDescription: 'Track your sponsorship returns.',
        myRevenueTitle: 'My Revenue',
        myRevenueDescription: 'Direct revenue generated for you from sponsored products.',
        productHeader: 'Product',
        nameHeader: 'Name',
        revenueHeader: 'Revenue',
        sharedRevenueTitle: 'Shared Revenue',
        sharedRevenueDescription: 'Profit shared with artisans from successful sales.',
        artisanHeader: 'Artisan',
        artisanShareHeader: "Artisan's Share",
        sharedAmountHeader: 'Shared Amount',
    });
    
    useEffect(() => {
        const translateContent = async () => {
            if (language !== 'en') {
                const textsToTranslate = [
                    'Revenue Generated', 'Track your sponsorship returns.', 'My Revenue',
                    'Direct revenue generated for you from sponsored products.', 'Product', 'Name', 'Revenue',
                    'Shared Revenue', 'Profit shared with artisans from successful sales.', 'Artisan',
                    "Artisan's Share", 'Shared Amount',
                ];
                const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
                setTranslatedContent({
                    mainTitle: translatedTexts[0],
                    mainDescription: translatedTexts[1],
                    myRevenueTitle: translatedTexts[2],
                    myRevenueDescription: translatedTexts[3],
                    productHeader: translatedTexts[4],
                    nameHeader: translatedTexts[5],
                    revenueHeader: translatedTexts[6],
                    sharedRevenueTitle: translatedTexts[7],
                    sharedRevenueDescription: translatedTexts[8],
                    artisanHeader: translatedTexts[9],
                    artisanShareHeader: translatedTexts[10],
                    sharedAmountHeader: translatedTexts[11],
                });
            }
        };
        translateContent();
    }, [language]);


  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{translatedContent.mainTitle}</h1>
        <p className="text-lg text-muted-foreground">{translatedContent.mainDescription}</p>
      </header>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{translatedContent.myRevenueTitle}</CardTitle>
            <CardDescription>
              {translatedContent.myRevenueDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{translatedContent.productHeader}</TableHead>
                  <TableHead>{translatedContent.nameHeader}</TableHead>
                  <TableHead className="text-right">{translatedContent.revenueHeader}</TableHead>
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
            <CardTitle>{translatedContent.sharedRevenueTitle}</CardTitle>
            <CardDescription>
              {translatedContent.sharedRevenueDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{translatedContent.productHeader}</TableHead>
                  <TableHead>{translatedContent.artisanHeader}</TableHead>
                  <TableHead>{translatedContent.artisanShareHeader}</TableHead>
                  <TableHead className="text-right">{translatedContent.sharedAmountHeader}</TableHead>
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
