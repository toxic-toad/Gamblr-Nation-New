
// Using 'use client' for form interactions
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LogIn, Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const { login: appLogin } = useAuth(); // Renamed to avoid conflict
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await appLogin(userCredential.user); // AuthContext now handles redirect
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${userCredential.user.displayName || userCredential.user.email}!`,
      });
    } catch (firebaseError: any) {
      let errorMessage = "Invalid email or password.";
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = "The email address is not valid.";
      } else {
        console.error("Firebase login error:", firebaseError);
        errorMessage = "An unexpected error occurred. Please try again later.";
      }
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
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
          <CardTitle className="text-3xl font-bold text-primary text-glow-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground">Log in to access your GamblrNation account.</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90">Password</Label>
              <div className="relative">
                 <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 bg-input text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" passHref>
                  <Button variant="link" className="p-0 h-auto text-xs text-accent hover:text-accent/80">
                    Forgot Password?
                  </Button>
                </Link>
              </div>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-base py-3">
              {isSubmitting ? 'Logging In...' : <><LogIn className="mr-2 h-5 w-5" /> Log In</>}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" passHref>
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-semibold">
                  Sign Up
                </Button>
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
