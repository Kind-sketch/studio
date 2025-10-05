'use client';
import { useState } from 'react';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderRequestsPage() {
  const [orderRequests, setOrderRequests] = useState(products.slice(0, 3).map(p => ({...p, quantity: Math.floor(Math.random() * 3) + 1, buyerName: "Random Buyer"})));
  const { toast } = useToast();
  const router = useRouter();

  const handleAccept = (orderId: string) => {
    const orderToMove = orderRequests.find(order => order.id === orderId);
    
    // This is a mock implementation. In a real app, you'd update a database.
    // We'll store it in localStorage to persist between page loads for this demo.
    if (orderToMove) {
        const myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
        localStorage.setItem('myOrders', JSON.stringify([...myOrders, {...orderToMove, status: 'Processing', orderDate: new Date().toISOString()} ]));
    }

    setOrderRequests(prev => prev.filter(order => order.id !== orderId));
    toast({
      title: 'Order Accepted',
      description: 'The order has been moved to "My Orders".',
    });
    router.push('/artisan/orders/my-orders');
  };

  const handleDecline = (orderId: string) => {
    setOrderRequests(prev => prev.filter(order => order.id !== orderId));
    toast({
      variant: 'destructive',
      title: 'Order Declined',
      description: 'The order request has been removed.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Order Requests</h1>
        <p className="text-muted-foreground">Review and manage incoming orders from buyers.</p>
      </header>

      {orderRequests.length > 0 ? (
        <div className="space-y-4">
          {orderRequests.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
                <Image
                  src={order.image.url}
                  alt={order.name}
                  width={120}
                  height={120}
                  className="rounded-md object-cover aspect-square bg-muted"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg font-headline mb-1">{order.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">From: {order.buyerName}</p>
                  <p className="font-bold text-lg my-2">${(order.price * order.quantity).toFixed(2)}</p>
                  <p className="text-sm">Quantity: <span className="font-medium">{order.quantity}</span></p>
                </div>
                <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
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
      ) : (
        <Card className="flex items-center justify-center p-12">
            <div className="text-center text-muted-foreground">
                <p className="text-lg">No new order requests.</p>
                <p>Check back later for new opportunities.</p>
            </div>
        </Card>
      )}
    </div>
  );
}
