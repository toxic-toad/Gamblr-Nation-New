
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, LogOut, Camera, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, ChangeEvent, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase'; // Import auth for verification status
import { sendEmailVerification } from 'firebase/auth';

export default function ProfilePage() {
  const { currentUser, logout, isLoading, updateProfilePicture } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);


  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentUser) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string; // This is a data URL
        try {
          await updateProfilePicture(currentUser.id, imageUrl);
          toast({ title: "Profile Picture Updated", description: "Your new profile picture has been saved.", variant: "default" });
        } catch (error) {
          toast({ title: "Error Updating Profile", description: (error as Error).message || "Could not update profile picture.", variant: "destructive" });
        }
      };
      reader.onerror = () => {
        toast({ title: "Error Uploading", description: "Could not read the image file.", variant: "destructive" });
      }
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      setIsVerifying(true);
      try {
        await sendEmailVerification(auth.currentUser);
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox (and spam folder) to verify your email address.",
          variant: "default",
        });
        setIsVerificationEmailSent(true);
      } catch (error: any) {
        toast({
          title: "Error Sending Verification",
          description: error.message || "Could not send verification email. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    }
  };


  if (isLoading || !currentUser) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <p className="text-primary text-xl">Loading profile...</p>
        </div>
    );
  }
  
  const isEmailVerified = auth.currentUser?.emailVerified ?? false;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="glass-card">
        <CardHeader className="items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              {currentUser.profileImageUrl ? (
                <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.username || 'User'} />
              ) : null}
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?')}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <CardTitle className="text-3xl text-primary">{currentUser.username || 'User Profile'}</CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{currentUser.email}</span>
            {isEmailVerified ? (
              <ShieldCheck className="h-5 w-5 text-green-500" title="Email Verified"/>
            ) : (
              <ShieldCheck className="h-5 w-5 text-yellow-500" title="Email Not Verified"/>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEmailVerified && (
            <Card className="bg-yellow-500/10 border-yellow-500/30 p-4">
              <CardDescription className="text-yellow-200 text-sm text-center">
                Your email address is not verified.
              </CardDescription>
              <Button 
                onClick={handleSendVerificationEmail} 
                variant="link" 
                className="w-full text-yellow-400 hover:text-yellow-300 mt-2 p-0 h-auto"
                disabled={isVerificationEmailSent || isVerifying}
              >
                {isVerifying ? "Sending..." : (isVerificationEmailSent ? "Verification Email Sent" : "Send Verification Email")}
              </Button>
            </Card>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-accent flex items-center">
              <User className="mr-2 h-5 w-5" /> Account Details
            </h3>
            <p className="text-foreground/80"><strong>Username:</strong> {currentUser.username || <span className="italic text-muted-foreground">Not set</span>}</p>
            <p className="text-foreground/80"><strong>Email:</strong> {currentUser.email}</p>
            <p className="text-foreground/80"><strong>User ID:</strong> <span className="text-xs">{currentUser.id}</span></p>
          </div>
          
          <Button 
            onClick={handleUploadClick} 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Camera className="mr-2 h-5 w-5" /> Change Profile Picture
          </Button>

        </CardContent>
        <CardFooter>
           <Button 
            onClick={logout} 
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
