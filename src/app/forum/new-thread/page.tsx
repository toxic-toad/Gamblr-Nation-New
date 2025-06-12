// Using 'use client' for form interactions
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = ["General", "Game Discussion", "Marketplace", "Events", "Support", "Feedback"];

export default function NewThreadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('New Thread Data:', { title, content, category });
    toast({
      title: "Thread Created!",
      description: "Your new discussion thread has been posted successfully.",
      variant: "default",
    });
    
    setIsSubmitting(false);
    // In a real app, you might redirect to the new thread or the forum page
    router.push('/forum'); 
  };

  return (
    <div className="max-w-2xl mx-auto">
        <Button variant="outline" asChild className="mb-6 border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/forum">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
          </Link>
        </Button>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary text-glow-primary">Create New Thread</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground/90">Thread Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a catchy title for your thread"
                className="bg-input text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground/90">Category</Label>
              <Select onValueChange={setCategory} value={category} required>
                <SelectTrigger id="category" className="w-full bg-input text-foreground">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="hover:bg-primary/20 focus:bg-primary/30">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground/90">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, questions, or ideas..."
                rows={10}
                className="bg-input text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent">
              {isSubmitting ? 'Posting...' : <><Send className="mr-2 h-5 w-5" /> Post Thread</>}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
