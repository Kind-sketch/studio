
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

const tutorials = [
  {
    id: 'pottery-basics',
    title: 'Pottery Basics: Throwing a Bowl',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Learn the fundamental techniques of throwing a bowl on the potter\'s wheel, from centering the clay to shaping the final form.'
  },
  // Add more tutorial objects here
];

export default function TutorialDialog({ children }: { children: React.ReactNode }) {
  const [selectedTutorial, setSelectedTutorial] = useState(tutorials[0]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>App Tutorials</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-2">Topics</h3>
            <div className="flex flex-col gap-2">
              {tutorials.map((tutorial) => (
                <Button
                  key={tutorial.id}
                  variant={selectedTutorial.id === tutorial.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedTutorial(tutorial)}
                >
                  <Film className="mr-2 h-4 w-4" />
                  {tutorial.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">{selectedTutorial.title}</h3>
            <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                <video
                    key={selectedTutorial.id}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                >
                    <source src={selectedTutorial.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{selectedTutorial.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
