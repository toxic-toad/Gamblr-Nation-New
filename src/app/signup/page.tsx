
// Using 'use client' for form interactions
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Eye, EyeOff, Mail, KeyRound, User as UserIconLucide } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login: appLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions.');
      setIsSubmitting(false);
      return;
    }
    if (password.length < 8) { 
      setError('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      setIsSubmitting(false);
      return;
    }

    // Log the API key the auth instance is using
    if (auth && auth.app && auth.app.options && auth.app.options.apiKey) {
      console.log("API Key being used by Firebase Auth SDK:", auth.app.options.apiKey);
    } else {
      console.error("Firebase auth object, its options, or apiKey are not available for logging.");
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      
      await appLogin(userCredential.user, username); 

      toast({
        title: "Account Created!",
        description: "Welcome to GamblrNation Hub! You are now logged in.",
      });
      
    } catch (firebaseError: any) {
      console.error("Firebase signup error object:", firebaseError); 
      let errorMessage = `An unexpected error occurred. Code: ${firebaseError.code || 'N/A'}. Message: ${firebaseError.message || 'No specific message.'}`;
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please choose a stronger password.';
      } else if (firebaseError.code === 'auth/api-key-not-valid') {
        errorMessage = 'Firebase API Key is not valid. Please check your configuration. Code: auth/api-key-not-valid';
      }
      setError(errorMessage);
      toast({
        title: "Signup Failed",
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
          <CardTitle className="text-3xl font-bold text-primary text-glow-primary">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground">Join GamblrNation and dive into the action!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserIconLucide className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a cool username" required className="pl-10 bg-input text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary" autoComplete="username"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="pl-10 bg-input text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary" autoComplete="email"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" required className="pl-10 pr-10 bg-input text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary" autoComplete="new-password"/>
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required className="pl-10 pr-10 bg-input text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary" autoComplete="new-password"/>
                 <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"/>
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Button variant="link" asChild className="p-0 h-auto text-accent hover:text-accent/80"><Link href="/terms">Terms and Conditions</Link></Button>
              </Label>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-base py-3">
              {isSubmitting ? 'Creating Account...' : <><UserPlus className="mr-2 h-5 w-5" /> Sign Up</>}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" passHref>
                 <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-semibold">
                  Log In
                </Button>
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
