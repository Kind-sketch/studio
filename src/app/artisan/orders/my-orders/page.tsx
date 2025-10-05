'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { Package, Ship, CheckCircle } from 'lucide-react';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';
interface MyOrder extends Product {
  quantity: number;
  status: OrderStatus;
  orderDate: string;
  expectedDelivery: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    const myOrdersFromStorage = JSON.parse(localStorage.getItem('myOrders') || '[]');
    const enrichedOrders = myOrdersFromStorage.map((order: any) => {
        const deliveryDate = new Date(order.orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        return {
            ...order,
            expectedDelivery: deliveryDate.toISOString(),
        }
    })
    setOrders(enrichedOrders);
  }, []);

  const handleUpdate = (orderId: string) => {
    router.push(`/artisan/orders/update-status/${orderId}`);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-500';
      case 'Shipped': return 'bg-blue-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  const renderOrderList = (status: OrderStatus) => {
    const filteredOrders = orders.filter(order => order.status === status);

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
              <Image
                src={order.image.url}
                alt={order.name}
                width={150}
                height={150}
                className="rounded-md object-cover aspect-square bg-muted"
              />
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg font-headline">{order.name}</CardTitle>
                <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>Quantity: <span className="font-medium">{order.quantity}</span></p>
                    <p>Order Date: <span className="font-medium">{format(new Date(order.orderDate), 'PPP p')}</span></p>
                    <p>Expected Delivery: <span className="font-medium">{format(new Date(order.expectedDelivery), 'PPP')}</span></p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <p className="font-bold text-lg">${(order.price * order.quantity).toFixed(2)}</p>
                <Button onClick={() => handleUpdate(order.id)} size="sm">Update Status</Button>
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
        <h1 className="font-headline text-4xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Manage your accepted orders and track their status.</p>
      </header>

      <Tabs defaultValue="processing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="processing">
            <Package className="mr-2 h-4 w-4" /> Processing
          </TabsTrigger>
          <TabsTrigger value="shipped">
            <Ship className="mr-2 h-4 w-4" /> Shipped
          </TabsTrigger>
          <TabsTrigger value="delivered">
            <CheckCircle className="mr-2 h-4 w-4" /> Delivered
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
    </div>
  );
}
