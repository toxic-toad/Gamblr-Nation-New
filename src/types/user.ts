
export interface User {
  id: string; // Corresponds to Firebase uid
  username: string | null; // Corresponds to Firebase displayName
  email: string | null;
  profileImageUrl?: string | null; // Corresponds to Firebase photoURL
  // Password is not stored here as Firebase handles it
}
