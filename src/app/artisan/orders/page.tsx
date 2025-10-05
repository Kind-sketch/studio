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

  useEffect(() => {
    // Load my orders from localStorage
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

    // Mock loading order requests
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
            expectedDelivery: '', // This will be set in the effect
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
          title: 'Order Accepted',
          description: 'The order has been moved to "My Orders".',
        });
    }
  };

  const handleDecline = (orderId: string) => {
    const updatedRequests = orderRequests.filter(order => order.id !== orderId);
    setOrderRequests(updatedRequests);
    localStorage.setItem('orderRequests', JSON.stringify(updatedRequests));

    toast({
      variant: 'destructive',
      title: 'Order Declined',
      description: 'The order request has been removed.',
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
          <p>No orders in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
               <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <Image
                    src={order.image.url}
                    alt={order.name}
                    width={128}
                    height={128}
                    className="rounded-md object-cover aspect-square bg-muted"
                />
               </div>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg font-headline leading-tight">{order.name}</CardTitle>
                <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>Quantity: <span className="font-medium">{order.quantity}</span></p>
                    <p>Order Date: <span className="font-medium">{format(new Date(order.orderDate), 'PPP')}</span></p>
                    <p>Expected Delivery: <span className="font-medium">{format(new Date(order.expectedDelivery), 'PPP')}</span></p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 w-full sm:w-auto self-end sm:self-center">
                <p className="font-bold text-lg">₹{(order.price * order.quantity).toFixed(2)}</p>
                <Button onClick={() => handleUpdate(order.id)} size="sm">Update Status</Button>
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
                <p className="text-lg">No new order requests.</p>
                <p>Check back later for new opportunities.</p>
            </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {orderRequests.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <Image
                    src={order.image.url}
                    alt={order.name}
                    width={128}
                    height={128}
                    className="rounded-md object-cover aspect-square bg-muted"
                />
               </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-headline mb-1 leading-tight">{order.name}</CardTitle>
                <p className="text-sm text-muted-foreground">From: {order.buyerName}</p>
                <p className="font-bold text-lg my-2">₹{(order.price * order.quantity).toFixed(2)}</p>
                <p className="text-sm">Quantity: <span className="font-medium">{order.quantity}</span></p>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                <Button onClick={() => handleAccept(order.id)} className="w-full">
                  <Check className="mr-2 h-4 w-4" /> Accept
                </Button>
                <Button onClick={() => handleDecline(order.id)} variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" /> Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Manage Orders</h1>
        <p className="text-muted-foreground">Review requests and track ongoing orders.</p>
      </header>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Order Requests</TabsTrigger>
          <TabsTrigger value="my-orders">My Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          {renderRequests()}
        </TabsContent>
        <TabsContent value="my-orders">
          <Tabs defaultValue="processing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 text-xs">
              <TabsTrigger value="processing">
                <Package className="mr-1 h-4 w-4" /> Processing
              </TabsTrigger>
              <TabsTrigger value="shipped">
                <Ship className="mr-1 h-4 w-4" /> Shipped
              </TabsTrigger>
              <TabsTrigger value="delivered">
                <CheckCircle className="mr-1 h-4 w-4" /> Delivered
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