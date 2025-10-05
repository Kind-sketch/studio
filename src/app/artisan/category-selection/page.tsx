'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';

export default function CategorySelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = () => {
    if (selectedCategories.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No categories selected',
        description: 'Please select at least one craft category.',
      });
      return;
    }
    // In a real app, save this to the user's profile
    console.log('Selected categories:', selectedCategories);
    toast({
      title: 'Categories Saved!',
      description: "You're ready to start selling.",
    });
    router.push('/artisan/profile');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Select Your Crafts</CardTitle>
          <CardDescription>Choose the categories that best describe your work. You can select more than one.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                className="h-20 flex-col gap-2 relative"
                onClick={() => toggleCategory(category.id)}
              >
                {selectedCategories.includes(category.id) && (
                  <div className="absolute top-2 right-2 bg-background text-primary rounded-full p-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <category.icon className="h-6 w-6" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={handleSave} className="w-full">
            Save and Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
