
'use client';

import { useState, useCallback } from 'react';
import ChatBubble from './ChatBubble';
import ChatSidebar from './ChatSidebar';
import { cn } from '@/lib/utils';

export default function ChatSystem() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);
  
  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return (
    <>
      {!isChatOpen && <ChatBubble onClick={openChat} />}
      {isChatOpen && <div 
        className={cn(
            "fixed z-30 bg-black/50 backdrop-blur-sm md:hidden",
            "top-16 left-0 right-0 bottom-0 h-[calc(100vh-4rem)]" // Adjusted top and height
            )} 
        onClick={closeChat} 
        />}
      <ChatSidebar isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
}
