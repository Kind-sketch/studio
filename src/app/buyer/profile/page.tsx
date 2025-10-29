
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signOut } from 'firebase/auth';
import { LogOut, User, ShoppingBag, ChevronLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import type { Product } from '@/lib/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/context/translation-context';

interface BuyerOrder extends Product {
  orderDate: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export default function BuyerProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  const { user } = useUser();
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const { translations } = useTranslation();
  const t = translations.buyer_profile_page;

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('buyerOrders') || '[]');
    setOrders(storedOrders);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: t.logoutSuccessToast,
        description: t.logoutSuccessToastDesc,
      });
      router.push('/');
    } catch (error) {
      console.error('Logout Error:', error);
      toast({
        variant: 'destructive',
        title: t.logoutFailedToast,
        description: t.logoutFailedToastDesc,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button onClick={() => router.back()} variant="ghost" className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        {translations.buyer_product_page.backButton}
      </Button>
      <Card className="w-full shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="font-headline text-2xl md:text-3xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarFallback>
                        <User className="h-8 w-8" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold">{user?.phoneNumber || "Buyer"}</h3>
                    <p className="text-sm text-muted-foreground">{t.welcome}</p>
                </div>
            </div>

          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            {t.logoutButton}
          </Button>
        </CardContent>
      </Card>
      
      <Card className="w-full shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><ShoppingBag className="h-5 w-5"/>{t.orderHistoryTitle}</CardTitle>
            <CardDescription>{t.orderHistoryDescription}</CardDescription>
        </CardHeader>
        <CardContent>
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id}>
                            <div className="flex gap-4">
                                <Image src={order.image.url} alt={order.name} width={64} height={64} className="rounded-md object-cover aspect-square bg-muted"/>
                                <div className="flex-grow">
                                    <h4 className="font-semibold">{order.name}</h4>
                                    <p className="text-sm text-muted-foreground">{translations.buyer_product_page.by} {order.artisan.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.orderedOn} {format(new Date(order.orderDate), 'PPP')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">₹{order.price.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">{order.status}</p>
                                </div>
                            </div>
                           <Separator className="my-4" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>{t.noPurchases}</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

      