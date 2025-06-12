
// Using 'use client' for form interactions
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Not strictly needed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  // const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email) {
      setError('Email address is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${email}, you will receive an email with instructions to reset your password. Please check your spam folder as well.`,
        variant: "default",
      });
      // Optionally clear form or redirect, but usually better to keep user on the page
      // setEmail(''); 
      // router.push('/login'); 
    } catch (firebaseError: any) {
      let errorMessage = "Failed to send password reset email.";
      if (firebaseError.code === 'auth/user-not-found') {
        // Don't reveal if user exists for security, Firebase handles this gracefully
        // Show generic success message as above
         toast({
            title: "Password Reset Email Sent",
            description: `If an account exists for ${email}, you will receive an email with instructions to reset your password. Please check your spam folder as well.`,
            variant: "default",
        });
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
        setError(errorMessage);
         toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.error("Firebase password reset error:", firebaseError);
        errorMessage = "An unexpected error occurred. Please try again later.";
        setError(errorMessage);
         toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md glass-card p-2 md:p-4">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-6">
            <Logo className="h-12 w-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold text-primary text-glow-primary">Forgot Your Password?</CardTitle>
          <CardDescription className="text-muted-foreground">Enter your email address and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 bg-input text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary"
                  autoComplete="email"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-base py-3">
              {isSubmitting ? 'Sending...' : <><Send className="mr-2 h-5 w-5" /> Send Reset Link</>}
            </Button>
            <Link href="/login" passHref>
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-semibold flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Log In
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
