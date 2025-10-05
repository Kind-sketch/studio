import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ArtisanDashboard() {
  const recentSales = products.slice(0, 5);
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Welcome back, Artisan!</h1>
        <p className="text-muted-foreground">Here's a snapshot of your creative haven.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Product Breakdown</CardTitle>
              <CardDescription>Performance of your individual products.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map(product => (
                  <div key={product.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                     <Image src={product.image.url} alt={product.name} width={64} height={64} className="rounded-md object-cover aspect-square"/>
                     <div className="flex-1 text-sm">
                       <p className="font-medium">{product.name}</p>
                       <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                     </div>
                     <div className="text-right text-sm">
                        <p className="font-medium">{product.sales} sales</p>
                        <p className="text-muted-foreground flex items-center justify-end gap-1"><Heart className="h-3 w-3"/>{product.likes}</p>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with your next masterpiece.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/artisan/promote"><PlusCircle className="mr-2 h-4 w-4"/> Add New Product</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/artisan/promote">Use AI Promote Tool</Link>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <Link href="/artisan/trends">View Market Trends</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
