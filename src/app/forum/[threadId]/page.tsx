
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for a single thread and its posts
const mockThread = {
  id: '1',
  title: 'Welcome to GamblrNation - Introduce Yourself!',
  author: 'Admin',
  createdAt: '3 days ago',
  category: 'General',
  content: 'Hello everyone, and welcome to the official GamblrNation community forum! This is the place to connect with fellow gamers, discuss your favorite titles, share strategies, and stay updated on all things GamblrNation. To get started, why not introduce yourself in this thread? Tell us a bit about your gaming journey, your favorite genres, or what you\'re most excited about in our community. We look forward to getting to know you all! Game on!',
};

const mockPosts = [
  { id: 'p1', author: 'GamerPro123', avatarSeed: 'Pro', createdAt: '3 days ago', content: 'Hey everyone! I\'m GamerPro123, mostly into FPS and RPGs. Excited to be here and check out the games!' },
  { id: 'p2', author: 'SkinCollector', avatarSeed: 'Skin', createdAt: '2 days ago', content: 'Hi! SkinCollector here. Looking forward to the marketplace and seeing what cool items pop up. Also, any MOBA players around?' },
  { id: 'p3', author: 'NewbieNoob', avatarSeed: 'Noob', createdAt: '1 day ago', content: 'Hello! Just joined. This platform looks awesome. Still figuring things out but happy to be part of the community.' },
];

interface Post {
  id: string;
  author: string;
  avatarSeed: string;
  createdAt: string;
  content: string;
}

export default function ThreadDetailPage({ params }: { params: { threadId: string } }) {
  const [replyContent, setReplyContent] = useState('');
  const [posts, setPosts] = useState<Post[]>(mockPosts); 

  const handleReplySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (replyContent.trim() === '') return;

    const newReply: Post = {
      id: `p${Date.now()}`,
      author: 'CurrentUser', 
      avatarSeed: 'User',
      createdAt: 'Just now',
      content: replyContent,
    };
    setPosts(prevPosts => [...prevPosts, newReply]);
    setReplyContent('');
  };

  return (
    <div className="space-y-8">
      <div>
        <Button variant="outline" asChild className="mb-6 border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/forum">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
          </Link>
        </Button>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl md:text-3xl text-primary">{mockThread.title}</CardTitle>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full whitespace-nowrap">{mockThread.category}</span>
            </div>
            <CardDescription className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center"><User className="mr-1 h-4 w-4 text-accent" /> By {mockThread.author}</span>
              <span className="flex items-center"><Clock className="mr-1 h-4 w-4 text-accent" /> {mockThread.createdAt}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{mockThread.content}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold text-primary flex items-center">
        <MessageSquare className="mr-2 h-6 w-6" /> Replies ({posts.length})
      </h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="glass-card">
            <CardHeader className="flex flex-row items-start space-x-4">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40/CCCCCC/333333.png" alt={post.author} data-ai-hint="user avatar" />
                <AvatarFallback className="bg-accent text-accent-foreground">{post.avatarSeed.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-accent">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                </div>
                <CardDescription className="text-foreground/80 mt-1 whitespace-pre-line">{post.content}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Post a Reply</CardTitle>
        </CardHeader>
        <form onSubmit={handleReplySubmit}>
          <CardContent>
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={5}
              className="bg-input text-foreground placeholder:text-muted-foreground"
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent">Submit Reply</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
