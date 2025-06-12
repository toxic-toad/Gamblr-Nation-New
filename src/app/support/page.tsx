'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Send } from 'lucide-react'; // Changed LifeBuoy to HelpCircle
import { useToast } from "@/hooks/use-toast";

const faqItems = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. Follow the instructions sent to your email address."
  },
  {
    question: "Where can I find my purchased items?",
    answer: "Purchased items from the marketplace are usually added to your in-game inventory or a specific section in your profile. If you can't find them, please check your transaction history or contact support."
  },
  {
    question: "How does the Daily Case work?",
    answer: "The Daily Case can be claimed once every 24 hours. It contains a random reward from a predefined loot table. Make sure to log in daily to maximize your rewards!"
  },
  {
    question: "Are there any rules for the forum?",
    answer: "Yes, please be respectful to other users, avoid spamming, and do not share any personal information. Detailed community guidelines can be found pinned in the 'General Discussion' section of the forum."
  },
  {
    question: "How can I report a bug or a player?",
    answer: "You can report bugs through the 'Game Test' feedback forms or via this support contact form. To report a player, please use the in-game reporting tools or provide detailed information (username, incident description, screenshots if possible) via the contact form."
  }
];

export default function SupportPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call for form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Support Request:', { name, email, message });
    toast({
      title: "Message Sent!",
      description: "Our support team will get back to you shortly.",
      variant: "default",
    });
    
    // Clear form
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <HelpCircle className="mx-auto h-16 w-16 text-accent mb-4 element-glow-accent" /> {/* Changed LifeBuoy to HelpCircle */}
        <h1 className="text-4xl font-bold text-primary text-glow-primary">Support Center</h1>
        <p className="text-muted-foreground mt-2">Need help? We're here for you. Check our FAQs or send us a message.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <Send className="mr-3 h-6 w-6" /> Contact Us
            </CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="bg-input text-foreground placeholder:text-muted-foreground"/>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-input text-foreground placeholder:text-muted-foreground"/>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" placeholder="Describe your issue or question in detail..." value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required className="bg-input text-foreground placeholder:text-muted-foreground"/>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <HelpCircle className="mr-3 h-6 w-6" /> Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find answers to common questions below.</CardDescription>
          </CardHeader>
          <CardContent>
            {faqItems.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border-primary/20">
                    <AccordionTrigger className="text-left hover:text-accent text-foreground/90 text-base">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-center py-4">No FAQs available at the moment. Please check back later or contact us directly.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
