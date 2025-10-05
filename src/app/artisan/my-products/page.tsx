
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

export default function MyProductsPage() {
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('myArtisanProducts') || '[]');
    setMyProducts(storedProducts);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold">My Products</h1>
          <p className="text-muted-foreground">Here is a list of all your creations.</p>
        </div>
        <Button asChild>
          <Link href="/artisan/add-product">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </header>

      {myProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
              <CardHeader className="p-3">
                <CardTitle className="font-headline text-base truncate">{product.name}</CardTitle>
                <CardDescription className="text-xs">
                  {product.createdAt ? 
                    `Added ${formatDistanceToNow(new Date(product.createdAt))} ago` :
                    'Just added'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-md font-semibold">₹{product.price.toFixed(2)}</p>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardTitle>No products yet!</CardTitle>
          <CardDescription className="mt-2 mb-6">
            It looks like you haven't added any products.
          </CardDescription>
          <Button asChild>
            <Link href="/artisan/add-product">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Product
            </Link>
          </Button>
        </Card>
      )}
       <Link href="/artisan/add-product" className="fixed bottom-8 right-8">
        <Button size="icon" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
