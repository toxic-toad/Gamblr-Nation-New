import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, PlusCircle, Eye, MessageCircleIcon as RepliesIcon } from 'lucide-react';
import Image from 'next/image';

// Mock data for discussion threads
const threads = [
  { id: '1', title: 'Welcome to GamblrNation - Introduce Yourself!', author: 'Admin', replies: 15, views: 120, lastPost: '2 hours ago', category: 'General' },
  { id: '2', title: 'Best Strategies for "Cosmic Conquest"?', author: 'GamerPro123', replies: 8, views: 95, lastPost: '45 minutes ago', category: 'Game Discussion' },
  { id: '3', title: 'Marketplace Wishlist - What skins do you want to see?', author: 'SkinCollector', replies: 22, views: 150, lastPost: '5 hours ago', category: 'Marketplace' },
  { id: '4', title: 'Upcoming Tournament - Sign-ups Open!', author: 'EventMaster', replies: 30, views: 200, lastPost: '1 day ago', category: 'Events' },
  { id: '5', title: 'Bug Report: Issue with Daily Case rewards', author: 'ConcernedUser', replies: 5, views: 60, lastPost: '30 minutes ago', category: 'Support' },
];

export default function ForumPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-primary text-glow-primary">Community Forum</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent">
          <Link href="/forum/new-thread">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Thread
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {threads.map((thread) => (
          <Card key={thread.id} className="hover:shadow-primary/20 hover:border-primary/50 transition-all duration-200 glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Link href={`/forum/${thread.id}`} className="hover:text-primary">
                  <CardTitle className="text-xl md:text-2xl">{thread.title}</CardTitle>
                </Link>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{thread.category}</span>
              </div>
              <CardDescription>
                Started by <span className="font-semibold text-accent">{thread.author}</span> - Last post: {thread.lastPost}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <RepliesIcon className="mr-1.5 h-4 w-4 text-primary" /> {thread.replies} Replies
                </div>
                <div className="flex items-center">
                  <Eye className="mr-1.5 h-4 w-4 text-primary" /> {thread.views} Views
                </div>
            </CardContent>
            <CardFooter>
               <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                 <Link href={`/forum/${thread.id}`}>View Thread</Link>
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       {threads.length === 0 && (
        <Card className="text-center py-12 glass-card">
          <CardHeader>
            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Threads Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Be the first one to start a discussion!</p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/forum/new-thread">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Thread
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
