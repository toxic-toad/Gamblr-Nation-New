
import type {Metadata} from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import ChatSystem from '@/components/chat/ChatSystem';
import SupportBubble from '@/components/support/SupportBubble';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { JackpotProvider } from '@/context/JackpotContext';
import Footer from '@/components/layout/Footer'; // Import Footer

export const metadata: Metadata = {
  title: 'Gamblr Nation',
  description: 'Your ultimate gaming community destination.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <AuthProvider>
          <JackpotProvider>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer /> {/* Add Footer here */}
            <ChatSystem />
            <SupportBubble />
            <Toaster />
          </JackpotProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
