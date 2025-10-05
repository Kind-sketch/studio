'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatsChart from '@/components/stats-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { statsData } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  likes: {
    label: 'Likes',
    color: 'hsl(var(--chart-1))',
  },
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type Period = 'weekly' | 'monthly' | 'yearly';

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>('monthly');

  const onPeriodChange = (value: string) => {
    setPeriod(value as Period);
  };
  
  const activeData = statsData[period];
  const dataKey = period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Your Performance</h1>
        <p className="text-muted-foreground">Analyze your sales and engagement over time.</p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Likes vs. Sales</CardTitle>
              <CardDescription>
                Showing data for {period.charAt(0).toUpperCase() + period.slice(1)} performance.
              </CardDescription>
            </div>
            <Tabs defaultValue={period} onValueChange={onPeriodChange} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <StatsChart data={activeData} config={chartConfig} dataKey={dataKey}/>
        </CardContent>
      </Card>
    </div>
  );
}
