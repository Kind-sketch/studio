
'use client';

import { useParams, useRouter } from 'next/navigation';
import { products } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import Reviews from '@/components/reviews';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/translation-context';
import type { Product } from '@/lib/types';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';
interface MyOrder extends Product {
  quantity: number;
  status: OrderStatus;
  orderDate: string;
  expectedDelivery: string;
}

interface OrderRequest extends Product {
    quantity: number;
    buyerName: string;
}


export default function BuyerProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params.productId as string;
  const product = products.find(p => p.id === productId);
  const { translations } = useTranslation();
  const t = translations.buyer_product_page;

  if (!product) {
    return <div className="p-4 text-center">{t.productNotFound}</div>;
  }

  const handleBuyNow = () => {
    // Add to buyer's orders
    const buyerOrders = JSON.parse(localStorage.getItem('buyerOrders') || '[]');
    const newBuyerOrder = {
        ...product,
        orderDate: new Date().toISOString(),
        status: 'Processing',
        quantity: 1
    };
    localStorage.setItem('buyerOrders', JSON.stringify([newBuyerOrder, ...buyerOrders]));
    
    // Add to artisan's order requests
    const orderRequests = JSON.parse(localStorage.getItem('orderRequests') || '[]');
     const newRequest: OrderRequest = {
        ...product,
        quantity: 1,
        buyerName: "Valued Customer" // In a real app, this would be the buyer's name
    };
    localStorage.setItem('orderRequests', JSON.stringify([newRequest, ...orderRequests]));


    toast({
      title: t.toastTitle,
      description: t.toastDescription.replace('{productName}', product.name),
    });
  };

  return (
    <div className="p-4">
       <Button onClick={() => router.back()} variant="ghost" className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t.backButton}
      </Button>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.image.url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-2xl md:text-3xl">{product.name}</CardTitle>
            <p className="font-semibold text-xl md:text-2xl pt-2 whitespace-nowrap">₹{product.price.toFixed(2)}</p>
          </div>
           <CardDescription>{t.by} {product.artisan.name}</CardDescription>
           {product.reviews && <Reviews rating={product.reviews.rating} count={product.reviews.count} />}
        </CardHeader>
        <CardContent>
            <Separator className="my-4" />
            <div>
                <h3 className="font-headline text-lg font-semibold mb-2">{t.description}</h3>
                <p className="text-muted-foreground">{product.description}</p>
            </div>
            {product.story && (
                <>
                    <Separator className="my-4" />
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-2">{t.story}</h3>
                        <p className="text-muted-foreground italic">"{product.story}"</p>
                    </div>
                </>
            )}
        </CardContent>
        <CardContent>
            <Button onClick={handleBuyNow} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t.buyNowButton}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
