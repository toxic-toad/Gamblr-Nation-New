
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

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  name: string;
  avatar?: string;
  userAvatarUrl?: string;
  timestamp: Date;
  botAvatarHint?: string;
}

const MAX_CHAT_LENGTH = 160;
const MOCK_LIVE_USERS = 2;
const SLOW_MODE_DELAY_MS = 5000; // 5 seconds
const SANITIZE_REGEX = /[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g;


export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);

  const botName = "Gamblr Nation Bot";
  const botAvatarPlaceholder = "https://placehold.co/40x40/A050C3/FFFFFF.png";
  const botAvatarHint = "cartoon monkey";

  useEffect(() => {
    if (isOpen && !authIsLoading) {
      if (currentUser) {
        setMessages([
          { id: 'welcome-bot', text: `Hi ${currentUser.username}! How can I help you? (Simulated)`, sender: 'bot', name: botName, timestamp: new Date(), avatar: botAvatarPlaceholder, botAvatarHint: botAvatarHint }
        ]);
      } else {
        setMessages([
          { id: 'login-prompt-bot', text: `Welcome! Please log in or sign up to chat.`, sender: 'bot', name: botName, timestamp: new Date(), avatar: botAvatarPlaceholder, botAvatarHint: botAvatarHint }
        ]);
      }
      setInputValue('');
      setLastMessageTime(0); // Reset slow mode timer when chat opens/user changes
    }
  }, [isOpen, currentUser, authIsLoading]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Sanitize input to allow only specified characters
    value = value.replace(SANITIZE_REGEX, '');

    if (value.length <= MAX_CHAT_LENGTH) {
      setInputValue(value);
    } else {
      setInputValue(value.substring(0, MAX_CHAT_LENGTH));
      // Toast for max length is shown when trying to send or add emoji if it exceeds
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

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (authIsLoading) {
      toast({
        title: "Loading...",
        description: "Please wait while we check your login status.",
        variant: "default",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to send messages.",
        variant: "destructive",
      });
      return;
    }

    const now = Date.now();
    if (now - lastMessageTime < SLOW_MODE_DELAY_MS) {
      const timeLeft = Math.ceil((SLOW_MODE_DELAY_MS - (now - lastMessageTime)) / 1000);
      toast({
        title: "Slow Mode Active",
        description: `Please wait ${timeLeft} second${timeLeft > 1 ? 's' : ''} before sending another message.`,
        variant: "destructive",
      });
      return;
    }
    
    const trimmedMessage = inputValue.trim();
    if (trimmedMessage === '') return;

    if (trimmedMessage.length > MAX_CHAT_LENGTH) {
        toast({ title: "Character limit reached", description: `Maximum ${MAX_CHAT_LENGTH} characters allowed. Your message is too long.`, variant: "destructive" });
        return;
    }


    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedMessage,
      sender: 'user',
      name: currentUser.username,
      userAvatarUrl: currentUser.profileImageUrl,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setLastMessageTime(Date.now());


    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thanks, ${currentUser.username}! I've received your message. (Simulated)`,
        sender: 'bot',
        name: botName,
        avatar: botAvatarPlaceholder,
        botAvatarHint: botAvatarHint,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
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
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-primary rounded-full" />
            <span className="text-sm font-medium text-primary">{MOCK_LIVE_USERS}</span>
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
              const isUserMessage = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={cn('flex items-start gap-2.5 max-w-[80%]' , isUserMessage ? 'flex-row-reverse' : 'flex-row')}>
                    <Avatar className="h-8 w-8 shrink-0">
                      {isUserMessage && currentUser ? (
                        <>
                          {msg.userAvatarUrl ? (
                            <AvatarImage src={msg.userAvatarUrl} alt={currentUser.username} data-ai-hint="user avatar"/>
                          ) : null}
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : <UserIconLucide className="h-4 w-4" />}
                          </AvatarFallback>
                        </>
                      ) : ( 
                        <>
                          <AvatarImage src={msg.avatar} alt={msg.name} data-ai-hint={msg.botAvatarHint} />
                          <AvatarFallback className="bg-accent text-accent-foreground">GN</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className={cn('flex flex-col gap-0.5 min-w-0', isUserMessage ? 'items-end' : 'items-start')}>
                      <span className="text-xs font-semibold text-foreground px-1">{msg.name}</span>
                      <div
                        className={cn(
                          'p-3 rounded-lg text-sm font-normal min-w-0 break-words', 
                          isUserMessage
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-secondary text-secondary-foreground rounded-bl-none'
                        )}
                      >
                        {msg.text}
                      </div>
                       <div
                        className={cn(
                          'text-xs px-1 pt-0.5', 
                          isUserMessage ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'
                        )}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border space-y-2">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={authIsLoading ? "Checking login..." : (currentUser ? "Type Message Here..." : "Log in to chat...")}
                className="flex-grow bg-input text-foreground placeholder:text-muted-foreground pr-10 rounded-md" 
                aria-label="Chat message input"
                disabled={authIsLoading || !currentUser}
                maxLength={MAX_CHAT_LENGTH} // HTML5 attribute for visual feedback, JS handles the actual limit
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

