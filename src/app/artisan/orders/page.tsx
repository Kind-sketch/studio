
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Check, X, Package, Ship, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { products as sampleProducts } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';

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

export default function OrdersPage() {
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [myOrders, setMyOrders] = useState<MyOrder[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Manage Orders',
    description: 'Review requests and track ongoing orders.',
    orderRequestsTab: 'Order Requests',
    myOrdersTab: 'My Orders',
    processingTab: 'Processing',
    shippedTab: 'Shipped',
    deliveredTab: 'Delivered',
    noOrdersInCategory: 'No orders in this category.',
    quantity: 'Quantity',
    orderDate: 'Order Date',
    expectedDelivery: 'Expected Delivery',
    updateStatusButton: 'Update Status',
    noNewRequests: 'No new order requests.',
    checkBackLater: 'Check back later for new opportunities.',
    from: 'From',
    acceptButton: 'Accept',
    declineButton: 'Decline',
    orderAcceptedToast: 'Order Accepted',
    orderAcceptedToastDesc: 'The order has been moved to "My Orders".',
    orderDeclinedToast: 'Order Declined',
    orderDeclinedToastDesc: 'The order request has been removed.',
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


  useEffect(() => {
    const myOrdersFromStorage = JSON.parse(localStorage.getItem('myOrders') || '[]');
    const enrichedOrders = myOrdersFromStorage.map((order: any) => {
        const deliveryDate = new Date(order.orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        return {
            ...order,
            expectedDelivery: deliveryDate.toISOString(),
        }
    });
    setMyOrders(enrichedOrders);

     if (!localStorage.getItem('myOrders') && !localStorage.getItem('hasLoadedOrderRequests')) {
        const initialRequests = sampleProducts.slice(0, 3).map(p => ({...p, quantity: Math.floor(Math.random() * 3) + 1, buyerName: "Random Buyer"}));
        setOrderRequests(initialRequests);
        localStorage.setItem('orderRequests', JSON.stringify(initialRequests));
        localStorage.setItem('hasLoadedOrderRequests', 'true');
     } else {
        setOrderRequests(JSON.parse(localStorage.getItem('orderRequests') || '[]'));
     }
  }, []);

  const handleAccept = (orderId: string) => {
    const orderToMove = orderRequests.find(order => order.id === orderId);
    
    if (orderToMove) {
        const newOrder: MyOrder = {
            ...orderToMove,
            status: 'Processing',
            orderDate: new Date().toISOString(),
            expectedDelivery: '',
        };

        const updatedMyOrders = [...myOrders, newOrder];
        localStorage.setItem('myOrders', JSON.stringify(updatedMyOrders));
        
        const deliveryDate = new Date(newOrder.orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        newOrder.expectedDelivery = deliveryDate.toISOString();
        setMyOrders(updatedMyOrders);
        
        const updatedRequests = orderRequests.filter(order => order.id !== orderId);
        setOrderRequests(updatedRequests);
        localStorage.setItem('orderRequests', JSON.stringify(updatedRequests));

        toast({
          title: translatedContent.orderAcceptedToast,
          description: translatedContent.orderAcceptedToastDesc,
        });
    }
  };

  const handleDecline = (orderId: string) => {
    const updatedRequests = orderRequests.filter(order => order.id !== orderId);
    setOrderRequests(updatedRequests);
    localStorage.setItem('orderRequests', JSON.stringify(updatedRequests));

    toast({
      variant: 'destructive',
      title: translatedContent.orderDeclinedToast,
      description: translatedContent.orderDeclinedToastDesc,
    });
  };

  const handleUpdate = (orderId: string) => {
    router.push(`/artisan/orders/update-status/${orderId}`);
  };

  const renderOrderList = (status: OrderStatus) => {
    const filteredOrders = myOrders.filter(order => order.status === status);

    if (filteredOrders.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-12">
          <p>{translatedContent.noOrdersInCategory}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-4">
               <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <Image
                    src={order.image.url}
                    alt={order.name}
                    width={96}
                    height={96}
                    className="rounded-md object-cover aspect-square bg-muted"
                />
               </div>
              <div className="flex-grow space-y-1">
                <CardTitle className="text-md font-headline leading-tight">{order.name}</CardTitle>
                <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>{translatedContent.quantity}: <span className="font-medium">{order.quantity}</span></p>
                    <p>{translatedContent.orderDate}: <span className="font-medium">{format(new Date(order.orderDate), 'PPP')}</span></p>
                    <p>{translatedContent.expectedDelivery}: <span className="font-medium">{format(new Date(order.expectedDelivery), 'PPP')}</span></p>
                </div>
                <p className="font-bold text-md pt-1">₹{(order.price * order.quantity).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-stretch gap-2 w-full sm:w-auto sm:self-center">
                <Button onClick={() => handleUpdate(order.id)} size="sm">{translatedContent.updateStatusButton}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderRequests = () => {
    if (orderRequests.length === 0) {
      return (
        <Card className="flex items-center justify-center p-12">
            <div className="text-center text-muted-foreground">
                <p className="text-lg">{translatedContent.noNewRequests}</p>
                <p>{translatedContent.checkBackLater}</p>
            </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {orderRequests.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-3 sm:p-4 flex items-start gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <Image
                    src={order.image.url}
                    alt={order.name}
                    width={96}
                    height={96}
                    className="rounded-md object-cover aspect-square bg-muted"
                />
               </div>
              <div className="flex-1">
                <CardTitle className="text-md font-headline mb-1 leading-tight">{order.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{translatedContent.from}: {order.buyerName}</p>
                <p className="font-bold text-md my-2">₹{(order.price * order.quantity).toFixed(2)}</p>
                <p className="text-sm">{translatedContent.quantity}: <span className="font-medium">{order.quantity}</span></p>
              </div>
              <div className="flex flex-col gap-2 mt-0 w-auto">
                <Button onClick={() => handleAccept(order.id)} size="sm">
                  <Check className="mr-2 h-4 w-4" /> {translatedContent.acceptButton}
                </Button>
                <Button onClick={() => handleDecline(order.id)} variant="outline" size="sm">
                  <X className="mr-2 h-4 w-4" /> {translatedContent.declineButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="font-headline text-3xl font-bold">{translatedContent.title}</h1>
        <p className="text-sm text-muted-foreground">{translatedContent.description}</p>
      </header>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">{translatedContent.orderRequestsTab}</TabsTrigger>
          <TabsTrigger value="my-orders">{translatedContent.myOrdersTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          {renderRequests()}
        </TabsContent>
        <TabsContent value="my-orders">
          <Tabs defaultValue="processing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 text-xs">
              <TabsTrigger value="processing">
                <Package className="mr-1 h-4 w-4" /> {translatedContent.processingTab}
              </TabsTrigger>
              <TabsTrigger value="shipped">
                <Ship className="mr-1 h-4 w-4" /> {translatedContent.shippedTab}
              </TabsTrigger>
              <TabsTrigger value="delivered">
                <CheckCircle className="mr-1 h-4 w-4" /> {translatedContent.deliveredTab}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="processing">
              {renderOrderList('Processing')}
            </TabsContent>
            <TabsContent value="shipped">
              {renderOrderList('Shipped')}
            </TabsContent>
            <TabsContent value="delivered">
              {renderOrderList('Delivered')}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
