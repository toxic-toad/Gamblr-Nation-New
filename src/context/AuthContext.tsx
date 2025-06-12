
'use client';

import type { User as AppUser } from '@/types/user';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';

interface AuthContextType {
  currentUser: AppUser | null;
  isLoading: boolean;
  login: (firebaseUser: FirebaseUser, appUsername?: string) => Promise<void>; // Adjusted to accept FirebaseUser
  logout: () => Promise<void>;
  updateProfilePicture: (userId: string, imageUrl: string) => Promise<void>;
  // No direct signup method here, handled by signup page then calls login
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          id: firebaseUser.uid,
          username: firebaseUser.displayName,
          email: firebaseUser.email,
          profileImageUrl: firebaseUser.photoURL,
        };
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (firebaseUser: FirebaseUser, appUsername?: string) => {
    // If displayName is not set on Firebase user (e.g. fresh signup) and appUsername is provided, update it.
    if (!firebaseUser.displayName && appUsername) {
      try {
        await updateProfile(firebaseUser, { displayName: appUsername });
      } catch (error) {
        console.error("Error updating display name on Firebase:", error);
        // Continue even if display name update fails, user is still logged in
      }
    }
    
    const appUser: AppUser = {
      id: firebaseUser.uid,
      username: appUsername || firebaseUser.displayName, // Prioritize appUsername if provided (for signup)
      email: firebaseUser.email,
      profileImageUrl: firebaseUser.photoURL,
    };
    setCurrentUser(appUser);
    // Only redirect if not already on a public page like '/' or '/games' to avoid redirect loops
    // Or if user is on login/signup pages
    if (pathname === '/login' || pathname === '/signup') {
        router.push('/');
    }
  }, [router, pathname]);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle error, e.g., show toast
    }
  }, [router]);

  const updateProfilePicture = useCallback(async (userId: string, imageUrl: string) => {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        await updateProfile(auth.currentUser, { photoURL: imageUrl });
        setCurrentUser(prevUser => prevUser ? { ...prevUser, profileImageUrl: imageUrl } : null);
      } catch (error) {
        console.error("Error updating profile picture in Firebase: ", error);
        throw error; // Re-throw to be caught by the calling component (e.g., to show a toast)
      }
    } else {
      console.error("User not logged in or mismatching ID for profile picture update.");
      throw new Error("User not authenticated or ID mismatch.");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, updateProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
