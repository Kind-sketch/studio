import ArtisanSidebar from '@/components/artisan-sidebar';
import { Button } from '@/components/ui/button';
import { Mic, MessageCircleQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ArtisanHeaderActions() {
    // This can't use the hook directly, so we'd pass handlers
    // For simplicity, defining handlers here. In a real app, use context or props.
    const handleMicClick = () => {
        // This is a placeholder, toast hook needs to be called from a client component context
        console.log('Mic clicked');
    };
    const handleSupportClick = () => {
        console.log('Support clicked');
    };

    return (
        <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMicClick}
              aria-label="Use Voice Command"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSupportClick}
              aria-label="Support"
            >
              <MessageCircleQuestion className="h-5 w-5" />
            </Button>
        </div>
    )
}

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <ArtisanSidebar />
        <main className="flex-1 overflow-y-auto bg-secondary/30">{children}</main>
      </div>
    </div>
  );
}
