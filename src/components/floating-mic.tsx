'use client';

import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FloatingMic() {
  const { toast } = useToast();

  const handleMicClick = () => {
    toast({
      title: 'Voice Input',
      description: 'Voice command functionality is not yet implemented.',
    });
  };

  return (
    <Button
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary shadow-lg ring-4 ring-primary/30 transition-transform hover:scale-110"
      onClick={handleMicClick}
    >
      <Mic className="h-8 w-8 text-primary-foreground" />
      <span className="sr-only">Use Voice Command</span>
    </Button>
  );
}
