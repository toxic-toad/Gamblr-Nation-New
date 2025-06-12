
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SupportBubble() {
  const pathname = usePathname();
  const router = useRouter();

  const isOnSupportPage = pathname === '/support';

  const handleBubbleClick = () => {
    if (isOnSupportPage) {
      router.back(); // Navigate back from support page
    } else {
      router.push('/support'); // Navigate to support page
    }
  };

  return (
    <Button
      onClick={handleBubbleClick}
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isOnSupportPage 
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 element-glow-destructive" 
          : "bg-accent text-accent-foreground hover:bg-accent/90 element-glow-accent"
      )}
      aria-label={isOnSupportPage ? "Close support and go back" : "Open support page"}
    >
      {isOnSupportPage ? <X className="h-7 w-7" /> : <HelpCircle className="h-7 w-7" />}
    </Button>
  );
}

