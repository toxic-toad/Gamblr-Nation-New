
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, LogOut, Camera, ShieldCheck, Edit3, Save, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, ChangeEvent, useState, FormEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const MAX_IMAGE_DIMENSION = 96; // Very small
const IMAGE_QUALITY = 0.7; // Moderate JPEG quality
const MAX_DATA_URL_LENGTH = 4000; // Extremely strict client-side check for data URI length
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;


export default function ProfilePage() {
  const { currentUser, logout, isLoading, updateProfilePicture, updateUserDisplayName } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [usernameError, setUsernameError] = useState('');


  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
    if (currentUser && !isEditingUsername) {
        setNewUsername(currentUser.username || '');
    }
  }, [currentUser, isLoading, router, isEditingUsername]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentUser) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image file (JPEG, PNG, GIF, WebP).", variant: "destructive" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { 
        toast({ title: "File Too Large", description: "Please select an image smaller than 2MB.", variant: "destructive" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const originalDataUrl = reader.result as string;
        const img = new window.Image();
        img.onload = async () => {
          let { width, height } = img;
          
          if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
              width = MAX_IMAGE_DIMENSION;
            } else {
              width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
              height = MAX_IMAGE_DIMENSION;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            toast({ title: "Error Processing Image", description: "Could not get canvas context.", variant: "destructive", duration: 7000 });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          
          const resizedMimeType = 'image/jpeg'; // Always convert to JPEG for better compression
          const resizedImageUrl = canvas.toDataURL(resizedMimeType, IMAGE_QUALITY);

          if (resizedImageUrl.length > MAX_DATA_URL_LENGTH) {
             toast({
               title: "Upload Failed: Image Data Too Large",
               description: `Even after resizing to ${MAX_IMAGE_DIMENSION}px, the image data is still too long (exceeds our internal limit of ${MAX_DATA_URL_LENGTH} characters). Please try a much simpler or smaller original image file.`,
               variant: "destructive",
               duration: 10000, 
              });
             if (fileInputRef.current) fileInputRef.current.value = "";
             return;
          }

          try {
            await updateProfilePicture(currentUser.id, resizedImageUrl);
            toast({ title: "Profile Picture Updated", description: "Your new profile picture has been saved.", variant: "default" });
          } catch (error: any) {
            if ((error as any).code === 'auth/invalid-profile-attribute') {
                toast({
                  title: "Upload Failed by Firebase",
                  description: "Firebase rejected the image data as too long. The image is too complex even after resizing. Please try a different, much smaller, or simpler image.",
                  variant: "destructive",
                  duration: 10000,
                });
            } else {
                toast({ title: "Error Updating Profile", description: error.message || "Could not update profile picture.", variant: "destructive", duration: 7000 });
            }
          }
        };
        img.onerror = () => {
            toast({ title: "Error Loading Image", description: "Could not load the image for processing. It might be corrupted or an unsupported format.", variant: "destructive", duration: 7000 });
        }
        img.src = originalDataUrl;
      };
      reader.onerror = () => {
        toast({ title: "Error Uploading", description: "Could not read the image file.", variant: "destructive", duration: 7000 });
      }
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
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

  const handleUsernameChangeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    if (!currentUser) return;

    const trimmedUsername = newUsername.trim();
    if (trimmedUsername.length < MIN_USERNAME_LENGTH || trimmedUsername.length > MAX_USERNAME_LENGTH) {
      setUsernameError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      setUsernameError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (trimmedUsername === currentUser.username) {
      setIsEditingUsername(false);
      return;
    }

    try {
      await updateUserDisplayName(currentUser.id, trimmedUsername);
      toast({
        title: "Username Updated!",
        description: `Your username is now ${trimmedUsername}. Note: Uniqueness across all users is not checked by this client-side update.`,
        variant: "default",
        duration: 7000,
      });
      setIsEditingUsername(false);
    } catch (error: any) {
      toast({
        title: "Error Updating Username",
        description: error.message || "Could not update username. Please try again.",
        variant: "destructive",
      });
      setUsernameError(error.message || "An unexpected error occurred.");
    }
  };

  const handleCancelEditUsername = () => {
    setIsEditingUsername(false);
    setNewUsername(currentUser?.username || '');
    setUsernameError('');
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
                <AvatarImage src={currentUser.profileImageUrl} alt={currentUser.username || 'User'} data-ai-hint="user avatar"/>
              ) : null}
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?')}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
            />
          </div>
          
          {!isEditingUsername ? (
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl text-primary">{currentUser.username || 'User Profile'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setIsEditingUsername(true); setNewUsername(currentUser.username || ''); setUsernameError(''); }} className="h-7 w-7 text-primary/70 hover:text-primary">
                <Edit3 className="h-5 w-5" />
                <span className="sr-only">Edit username</span>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUsernameChangeSubmit} className="w-full max-w-sm space-y-3">
              <Input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                className={cn("text-center text-lg bg-input", usernameError && "border-destructive")}
                minLength={MIN_USERNAME_LENGTH}
                maxLength={MAX_USERNAME_LENGTH}
              />
              {usernameError && <p className="text-xs text-destructive text-center">{usernameError}</p>}
              <div className="flex justify-center gap-2">
                <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="mr-1.5 h-4 w-4" /> Save
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleCancelEditUsername} className="text-muted-foreground hover:text-destructive">
                  <XCircle className="mr-1.5 h-4 w-4" /> Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="flex items-center gap-2 text-muted-foreground mt-1">
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

    