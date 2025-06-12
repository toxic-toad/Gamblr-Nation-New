
'use client';

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { Send, User as UserIconLucide, ChevronLeft, Skull, Smile, Info, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import ChatRulesDialog from './ChatRulesDialog';
import EmojiPicker from './EmojiPicker';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limitToLast,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string; // Firestore document ID
  text: string;
  senderId: string;
  senderUsername: string;
  senderAvatarUrl?: string | null;
  timestamp: Date; // Converted from Firestore Timestamp for display
  isCurrentUser: boolean; // Helper for styling
}

const MAX_CHAT_LENGTH = 160;
const SLOW_MODE_DELAY_MS = 5000; // 5 seconds
const SANITIZE_REGEX = /[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g;
const CHAT_COLLECTION = 'public-chat-messages';

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);

  // Listener for Firestore messages
  useEffect(() => {
    if (!isOpen || !db) {
      setMessages([]); 
      return; 
    }

    if (authIsLoading) {
      setMessages([{
        id: 'loading-auth-bot',
        text: 'Verifying login status...',
        senderId: 'bot',
        senderUsername: 'Gamblr Nation Bot',
        senderAvatarUrl: 'https://placehold.co/40x40/A050C3/FFFFFF.png',
        timestamp: new Date(),
        isCurrentUser: false,
      }]);
      return; 
    }

    if (!currentUser) {
      setMessages([{
        id: 'login-prompt-bot',
        text: 'Welcome! Please log in or sign up to chat.',
        senderId: 'bot',
        senderUsername: 'Gamblr Nation Bot',
        senderAvatarUrl: 'https://placehold.co/40x40/A050C3/FFFFFF.png',
        timestamp: new Date(),
        isCurrentUser: false,
      }]);
      return; 
    }

    const q = query(
      collection(db, CHAT_COLLECTION),
      orderBy('timestamp', 'asc'),
      limitToLast(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push({
            id: doc.id,
            text: data.text,
            senderId: data.senderId,
            senderUsername: data.senderUsername,
            senderAvatarUrl: data.senderAvatarUrl,
            timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
            isCurrentUser: data.senderId === currentUser.id,
          });
        });
        setMessages(fetchedMessages);
      },
      (error) => {
        console.error("Error fetching chat messages: ", error);
        toast({
          title: "Chat Error",
          description: "Could not load chat messages. Please check your connection or try again later.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [isOpen, currentUser, authIsLoading, toast]); // Removed db from dependencies as it should be stable


  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  
  useEffect(() => {
    if (isOpen) {
        setInputValue('');
        setLastMessageTime(0);
    }
  }, [isOpen, currentUser]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(SANITIZE_REGEX, '');
    if (value.length <= MAX_CHAT_LENGTH) {
      setInputValue(value);
    } else {
      setInputValue(value.substring(0, MAX_CHAT_LENGTH));
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (inputValue.length + emoji.length <= MAX_CHAT_LENGTH) {
      setInputValue(prev => prev + emoji);
    } else {
      toast({ title: "Character limit reached", description: "Cannot add emoji, maximum length exceeded.", variant: "destructive" });
    }
    setIsEmojiPickerOpen(false);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (authIsLoading || !currentUser) {
      toast({ 
        title: authIsLoading ? "Loading..." : "Login Required", 
        description: authIsLoading ? "Please wait." : "Please log in to send messages.", 
        variant: authIsLoading ? "default" : "destructive" 
      });
      return;
    }

    const now = Date.now();
    if (now - lastMessageTime < SLOW_MODE_DELAY_MS) {
      const timeLeft = Math.ceil((SLOW_MODE_DELAY_MS - (now - lastMessageTime)) / 1000);
      toast({ title: "Slow Mode Active", description: `Please wait ${timeLeft}s.`, variant: "destructive" });
      return;
    }
    
    const trimmedMessage = inputValue.trim();
    if (trimmedMessage === '') return;
    if (trimmedMessage.length > MAX_CHAT_LENGTH) {
        toast({ title: "Character limit reached", description: `Maximum ${MAX_CHAT_LENGTH} characters.`, variant: "destructive" });
        return;
    }

    // Optimistically clear input
    setInputValue('');

    const newMessage = {
      text: trimmedMessage,
      senderId: currentUser.id,
      senderUsername: currentUser.username || 'Anonymous',
      senderAvatarUrl: currentUser.profileImageUrl || null,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, CHAT_COLLECTION), newMessage);
      setLastMessageTime(Date.now());
    } catch (error) {
      console.error("Error sending message: ", error);
      toast({
        title: "Send Error",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
      // If send fails, optionally restore input value, though this can be complex
      // For now, we leave it cleared for simplicity of UI feedback.
      // setInputValue(trimmedMessage); // Example: Restore if send fails
    }
  };
  
  const characterCount = MAX_CHAT_LENGTH - inputValue.length;

  return (
    <div className={cn(
      "fixed left-0 z-40 w-80 bg-card text-card-foreground border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out",
      "top-16 h-[calc(100vh-4rem)]", 
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-sidebar-title"
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Skull className="h-5 w-5 text-muted-foreground" />
            <h2 id="chat-sidebar-title" className="text-md font-semibold text-foreground">Degen Chat</h2>
          </div>
          <Button
            type="button"
            size="icon"
            onClick={onClose}
            className="bg-accent text-accent-foreground hover:bg-accent/90 h-7 w-7"
            aria-label="Close chat"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        </header>

        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => {
              const isUserMsg = msg.isCurrentUser;
              let avatarSrc: string | undefined | null = msg.senderAvatarUrl;
              let avatarHint = "user avatar";
              let avatarFallbackText: React.ReactNode = msg.senderUsername ? msg.senderUsername.charAt(0).toUpperCase() : <UserIconLucide className="h-4 w-4" />;

              if (msg.senderId === 'bot') {
                avatarSrc = 'https://placehold.co/40x40/A050C3/FFFFFF.png';
                avatarHint = "cartoon monkey";
                avatarFallbackText = "B";
              } else if (isUserMsg && currentUser) { // Check currentUser here
                avatarSrc = currentUser.profileImageUrl;
              }

              return (
                <div key={msg.id} className={`flex ${isUserMsg && msg.senderId !== 'bot' ? 'justify-end' : 'justify-start'}`}>
                  <div className={cn(
                      'flex items-start gap-2.5 max-w-[80%]', 
                      isUserMsg && msg.senderId !== 'bot' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      {avatarSrc ? (
                        <AvatarImage src={avatarSrc} alt={msg.senderUsername} data-ai-hint={avatarHint} />
                      ) : null}
                      <AvatarFallback className={cn(
                        msg.senderId === 'bot' ? 'bg-accent text-accent-foreground' : (isUserMsg ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')
                      )}>
                        {avatarFallbackText}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                        'flex flex-col gap-0.5', 
                        isUserMsg && msg.senderId !== 'bot' ? 'items-end' : 'items-start'
                      )}
                    >
                      <span className="text-xs font-semibold text-foreground px-1">{msg.senderUsername}</span>
                      <div
                        className={cn(
                          'p-3 rounded-lg text-sm font-normal break-all whitespace-normal', 
                          isUserMsg && msg.senderId !== 'bot'
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-secondary text-secondary-foreground rounded-bl-none'
                        )}
                      >
                        {msg.text}
                      </div>
                       <div
                        className={cn(
                          'text-xs px-1 pt-0.5', 
                           isUserMsg && msg.senderId !== 'bot' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'
                        )}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
             {(authIsLoading || (!currentUser && !authIsLoading && messages.length === 1 && messages[0].id === 'login-prompt-bot') ) && messages.length <=1 && (
                // Display specific messages for loading or login prompt rather than a generic one if those are the only messages
                // This keeps the "Loading chat..." or "Login to chat..." message visible until other messages load or user logs in.
                // The condition `messages.length <=1` ensures that if actual chat messages arrive, this message gets replaced.
                null 
            )}
            {!authIsLoading && !currentUser && messages.length === 0 && (
                 <p className="text-muted-foreground text-center py-4">Log in to see the chat.</p>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border space-y-2">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={authIsLoading ? "Verifying login..." : (currentUser ? "Type Message Here..." : "Log in to chat...")}
                className="flex-grow bg-input text-foreground placeholder:text-muted-foreground pr-10 rounded-md" 
                aria-label="Chat message input"
                disabled={authIsLoading || !currentUser}
                maxLength={MAX_CHAT_LENGTH}
              />
              <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                    aria-label="Open emoji picker" 
                    disabled={authIsLoading || !currentUser}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 border-none shadow-none bg-transparent" 
                  side="top" 
                  align="end"
                  sideOffset={5}
                >
                  <EmojiPicker 
                    onEmojiSelect={handleEmojiSelect} 
                    onClose={() => setIsEmojiPickerOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              type="submit"
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              aria-label="Send message"
              disabled={authIsLoading || (inputValue.trim() === '' && !!currentUser) || !currentUser}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
           <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
              onClick={() => setIsRulesOpen(true)}
            >
              <Info className="h-3.5 w-3.5" /> Chat Rules
            </Button>
            <div className="flex items-center gap-1">
              <MessageSquareText className="h-3.5 w-3.5" />
              <span>{characterCount < 0 ? 0 : characterCount}</span>
            </div>
          </div>
          {!authIsLoading && !currentUser && isOpen && (
             <p className="text-xs text-muted-foreground mt-1 text-center">
              Want to join the conversation? <Link href="/login" className="text-primary hover:underline font-semibold">Log In</Link> or <Link href="/signup" className="text-primary hover:underline font-semibold">Sign Up</Link>.
            </p>
          )}
        </div>
      </div>
      <ChatRulesDialog isOpen={isRulesOpen} onOpenChange={setIsRulesOpen} />
    </div>
  );
}
    