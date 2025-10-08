
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from '@/context/translation-context';

export default function MyProductsPage() {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const { translations } = useTranslation();
  const t = translations.my_products_page;

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('myArtisanProducts') || '[]');
    setMyProducts(storedProducts);
  }, []);

  const formatTimeAgo = (date: string) => {
    const distance = formatDistanceToNow(new Date(date));
    if (translations.add_product_page.cameraError.includes('Error')) { // A simple check for English
        return `Added ${distance} ago`;
    }
    // A simple placeholder for other languages.
    return `${t.added} ${distance} ${t.ago}`;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </div>
      </header>

      {myProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {myProducts.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={product.image.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
              <CardHeader className="p-2 sm:p-3">
                <CardTitle className="font-headline text-sm sm:text-base truncate">{product.name}</CardTitle>
                <CardDescription className="text-xs">
                  {product.createdAt ? 
                    formatTimeAgo(product.createdAt) :
                    t.justAdded
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm sm:text-md font-semibold">₹{product.price.toFixed(2)}</p>
                  <Button variant="outline" size="sm">{t.editButton}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardTitle>{t.noProductsTitle}</CardTitle>
          <CardDescription className="mt-2 mb-6">
            {t.noProductsDescription}
          </CardDescription>
          <Button asChild>
            <Link href="/artisan/add-product">
              <PlusCircle className="mr-2 h-4 w-4" /> {t.addProductButton}
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
