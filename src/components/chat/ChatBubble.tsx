
'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  onClick: () => void;
  // isChatOpen is no longer needed here as this component will only be shown when chat is closed
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  return (
    <Button
      onClick={onClick}
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "bg-primary text-primary-foreground hover:bg-primary/90 element-glow-primary" 
      )}
      aria-label="Open chat"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
}
