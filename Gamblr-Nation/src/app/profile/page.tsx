
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, LogOut, ShieldCheck, Edit3, Save, XCircle, Palette, CheckSquare } from 'lucide-react'; // Added Palette, CheckSquare
import { useRouter } from 'next/navigation';
import { useEffect, useState, FormEvent } from 'react'; // Removed useRef, ChangeEvent as they were for file input
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Constants for username validation
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

// Predefined SVG Avatars
const predefinedSvgAvatars = [
  {
    key: 'geometricBurst',
    name: 'Geo Burst',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:hsl(var(--accent));stop-opacity:1" /><stop offset="100%" style="stop-color:hsl(var(--primary));stop-opacity:1" /></radialGradient></defs><circle cx="50" cy="50" r="45" fill="url(#grad1)" />${Array.from({ length: 12 }).map((_, i) => `<line x1="50" y1="50" x2="${50 + 45 * Math.cos(i * Math.PI / 6)}" y2="${50 + 45 * Math.sin(i * Math.PI / 6)}" stroke="hsl(var(--background))" stroke-width="2"/>`).join('')}<circle cx="50" cy="50" r="10" fill="hsl(var(--background))"/></svg>`,
  },
  {
    key: 'wavyLines',
    name: 'Wavy Lines',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="hsl(var(--primary))" /><path d="M0 20 Q 25 0, 50 20 T 100 20" stroke="hsl(var(--accent))" stroke-width="8" fill="none"/><path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="hsl(var(--accent))" stroke-width="8" fill="none"/><path d="M0 80 Q 25 60, 50 80 T 100 80" stroke="hsl(var(--accent))" stroke-width="8" fill="none"/></svg>`,
  },
  {
    key: 'pixelHeart',
    name: 'Pixel Heart',
    svgString: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="hsl(var(--background))" /><path d="M9 2H10V3H11V4H12V5H13V6H14V7H15V9H16V14H15V16H14V17H13V18H12V19H11V20H10V21H9V22H8V23H7V24H6V25H5V26H4V27H3V28H2V29H7V28H8V27H9V26H10V25H11V24H12V23H13V22H14V21H15V20H16V19H17V18H18V17H19V16H20V14H19V9H18V7H17V6H16V5H15V4H14V3H13V2H12V1H9V2Z" fill="hsl(var(--accent))"/><path d="M22 2H21V3H20V4H19V5H18V6H17V7H16V9H15V14H16V16H17V17H18V18H19V19H20V20H21V21H22V22H23V23H24V24H25V25H26V26H27V27H28V28H29V29H24V28H23V27H22V26H21V25H20V24H19V23H18V22H17V21H16V20H15V19H14V18H13V17H12V16H11V14H12V9H13V7H14V6H15V5H16V4H17V3H18V2H19V1H22V2Z" fill="hsl(var(--primary))"/></svg>`,
  },
  {
    key: 'controllerIcon',
    name: 'Controller',
    svgString: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M50,16H14a8,8,0,0,0-8,8V38a8,8,0,0,0,8,8H26v6.59a1,1,0,0,0,1.71.7L32,49l4.29,4.29A1,1,0,0,0,38,52.59V46H50a8,8,0,0,0,8-8V24A8,8,0,0,0,50,16ZM20,38a4,4,0,1,1,4-4A4,4,0,0,1,20,38Zm8-8H24V26h4Zm8,8a4,4,0,1,1,4-4A4,4,0,0,1,36,38Zm8-8H40V26h4Z" fill="hsl(var(--primary))"/><circle cx="20" cy="34" r="2" fill="hsl(var(--accent))"/><circle cx="36" cy="34" r="2" fill="hsl(var(--accent))"/><rect x="26" y="28" width="4" height="4" fill="hsl(var(--accent))"/><rect x="42" y="28" width="4" height="4" fill="hsl(var(--accent))"/></svg>`,
  },
  {
    key: 'elegantFlower',
    name: 'Flower',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gradFlower" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:hsl(var(--accent));stop-opacity:0.8" /><stop offset="100%" style="stop-color:hsl(var(--primary));stop-opacity:1" /></radialGradient></defs><path d="M50 10 C 40 25, 40 25, 30 30 C 20 35, 20 45, 25 50 C 30 55, 30 65, 40 70 C 45 75, 45 85, 50 90 C 55 85, 55 75, 60 70 C 70 65, 70 55, 75 50 C 80 45, 80 35, 70 30 C 60 25, 60 25, 50 10 Z" fill="url(#gradFlower)" /><path d="M50 10 C 60 25, 60 25, 70 30 C 80 35, 80 45, 75 50 C 70 55, 70 65, 60 70 C 55 75, 55 85, 50 90 C 45 85, 45 75, 40 70 C 30 65, 30 55, 25 50 C 20 45, 20 35, 30 30 C 40 25, 40 25, 50 10 Z" fill="none" stroke="hsl(var(--accent))" stroke-width="2" transform="rotate(30 50 50)" /><path d="M50 10 C 60 25, 60 25, 70 30 C 80 35, 80 45, 75 50 C 70 55, 70 65, 60 70 C 55 75, 55 85, 50 90 C 45 85, 45 75, 40 70 C 30 65, 30 55, 25 50 C 20 45, 20 35, 30 30 C 40 25, 40 25, 50 10 Z" fill="none" stroke="hsl(var(--primary))" stroke-width="1.5" transform="rotate(60 50 50)" /><circle cx="50" cy="50" r="5" fill="hsl(var(--background))" /></svg>`,
  },
  {
    key: 'cosmicSwirl',
    name: 'Cosmic Swirl',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="hsl(var(--background))" /><defs><linearGradient id="gradSwirl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:hsl(var(--primary));stop-opacity:1" /><stop offset="100%" style="stop-color:hsl(var(--accent));stop-opacity:1" /></linearGradient></defs><circle cx="50" cy="50" r="40" fill="none" stroke="url(#gradSwirl)" stroke-width="5" stroke-dasharray="10 15" transform="rotate(0 50 50)"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" /></circle><circle cx="50" cy="50" r="25" fill="none" stroke="hsl(var(--accent))" stroke-width="3" stroke-dasharray="5 10" transform="rotate(0 50 50)"><animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="8s" repeatCount="indefinite" /></circle><circle cx="50" cy="50" r="10" fill="hsl(var(--primary))" /></svg>`,
  },
];

// Helper to convert SVG string to Base64 Data URL
const convertSvgStringToDataUrl = (svgString: string) => {
  if (typeof btoa === 'function') { // Check if btoa is available (browser environment)
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  }
  // Fallback for Node.js or environments where btoa might not be globally available
  if (typeof Buffer !== 'undefined') {
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
  }
  console.error("btoa and Buffer are not available to encode SVG to Base64.");
  return ''; // Return empty or handle error as appropriate
};


export default function ProfilePage() {
  const { currentUser, logout, isLoading, updateProfilePicture, updateUserDisplayName } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [usernameError, setUsernameError] = useState('');

  const [showSvgSelector, setShowSvgSelector] = useState(false);
  const [selectedSvgKey, setSelectedSvgKey] = useState<string | null>(null);
  const [currentProfilePicUrl, setCurrentProfilePicUrl] = useState(currentUser?.profileImageUrl || '');


  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
    if (currentUser) {
      if (!isEditingUsername) {
        setNewUsername(currentUser.username || '');
      }
      // Sync currentProfilePicUrl with the actual saved URL if it changes and selector is not open
      // Also, try to pre-select the SVG if the current image URL matches one of the predefined ones
      if (currentUser.profileImageUrl !== currentProfilePicUrl && !showSvgSelector) {
        setCurrentProfilePicUrl(currentUser.profileImageUrl || '');
        const existingSvg = predefinedSvgAvatars.find(avatar => currentUser.profileImageUrl === convertSvgStringToDataUrl(avatar.svgString));
        setSelectedSvgKey(existingSvg ? existingSvg.key : null);
      } else if (!currentUser.profileImageUrl && !currentProfilePicUrl && !showSvgSelector) {
        // If user has no profile image and we have no local preview, clear selection
        setSelectedSvgKey(null);
      }
    }
  }, [currentUser, isLoading, router, isEditingUsername, currentProfilePicUrl, showSvgSelector]);


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
        description: `Your username is now ${trimmedUsername}. Note: Uniqueness is not checked by this client-side update.`,
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

  const handleSelectSvg = (svgKey: string) => {
    setSelectedSvgKey(svgKey);
    const svgData = predefinedSvgAvatars.find(s => s.key === svgKey);
    if (svgData) {
      // Update the preview immediately
      setCurrentProfilePicUrl(convertSvgStringToDataUrl(svgData.svgString));
    }
  };

  const handleSaveAvatar = async () => {
    if (!currentUser || !selectedSvgKey) {
      toast({ title: "No Avatar Selected", description: "Please select an avatar to save.", variant: "destructive" });
      return;
    }
    const svgData = predefinedSvgAvatars.find(s => s.key === selectedSvgKey);
    if (svgData) {
      const dataUrl = convertSvgStringToDataUrl(svgData.svgString);
      if (!dataUrl) {
         toast({ title: "Error Processing Avatar", description: "Could not convert SVG to data URL.", variant: "destructive" });
         return;
      }
      try {
        await updateProfilePicture(currentUser.id, dataUrl);
        toast({ title: "Avatar Updated", description: "Your new avatar has been saved.", variant: "default" });
        setShowSvgSelector(false);
        // currentProfilePicUrl will be updated by useEffect watching currentUser.profileImageUrl
      } catch (error: any) {
        toast({ title: "Error Updating Avatar", description: error.message || "Could not update avatar.", variant: "destructive" });
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
  // Use currentProfilePicUrl for the avatar display to show live preview from SVG selector
  const avatarToDisplay = currentProfilePicUrl || '';

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="glass-card">
        <CardHeader className="items-center text-center">
          <div className="relative group"> {/* Added group for visibility on hover if desired */}
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              {avatarToDisplay ? (
                <AvatarImage src={avatarToDisplay} alt={currentUser.username || 'User'} data-ai-hint="user avatar"/>
              ) : null}
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?')}
              </AvatarFallback>
            </Avatar>
            {/* Palette Button to toggle SVG selector */}
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-4 right-0 h-8 w-8 rounded-full bg-card/80 border-primary text-primary group-hover:opacity-100 opacity-60 transition-opacity"
              onClick={() => {
                setShowSvgSelector(prev => {
                  const openingSelector = !prev;
                  if (openingSelector) {
                    // When opening selector, set preview to current actual avatar & pre-select if it matches
                    setCurrentProfilePicUrl(currentUser.profileImageUrl || '');
                    const existingSvg = predefinedSvgAvatars.find(avatar => currentUser.profileImageUrl === convertSvgStringToDataUrl(avatar.svgString));
                    setSelectedSvgKey(existingSvg ? existingSvg.key : null);
                  }
                  return openingSelector;
                });
              }}
              aria-label="Change profile picture"
            >
              <Palette className="h-4 w-4" />
            </Button>
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

        {/* SVG Avatar Selector */}
        {showSvgSelector && (
          <CardContent className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-accent mb-4 text-center">Choose Your Avatar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {predefinedSvgAvatars.map((avatar) => (
                <Button
                  key={avatar.key}
                  variant="outline"
                  className={cn(
                    "h-24 w-full p-2 flex flex-col items-center justify-center gap-1 border-2 hover:border-accent",
                    selectedSvgKey === avatar.key ? "border-accent ring-2 ring-accent" : "border-primary/30"
                  )}
                  onClick={() => handleSelectSvg(avatar.key)}
                >
                  <div className="h-16 w-16" dangerouslySetInnerHTML={{ __html: avatar.svgString }} />
                  <span className="text-xs text-muted-foreground">{avatar.name}</span>
                </Button>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={handleSaveAvatar} className="bg-green-500 hover:bg-green-600 text-white">
                <CheckSquare className="mr-2 h-4 w-4" /> Save Avatar
              </Button>
              <Button variant="ghost" onClick={() => {
                setShowSvgSelector(false);
                setSelectedSvgKey(null); // Clear selection
                setCurrentProfilePicUrl(currentUser.profileImageUrl || ''); // Reset preview to saved avatar
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}

        <CardContent className={cn("space-y-6", showSvgSelector && "border-t border-border mt-6 pt-6")}>
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
          
          {/* The old button for file upload is INTENTIONALLY REMOVED HERE */}

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

