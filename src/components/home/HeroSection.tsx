
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 rounded-lg overflow-hidden bg-gradient-to-br from-primary/30 via-background to-background">
      <div className="absolute inset-0 opacity-10 element-glow-primary">
        {/* Decorative background pattern or subtle image could go here */}
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block mb-8 p-2 rounded-lg">
          <Logo className="h-16 md:h-24 w-auto mx-auto" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-glow-accent animate-pulse">
          Welcome to GamblrNation Hub!
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
          Your ultimate destination for gaming, community, and exclusive rewards. Dive into the action, connect with fellow gamers, and climb the ranks!
        </p>
        <div className="space-x-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent">
            <Link href="/games">Explore Games</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/forum">Join Discussions</Link>
          </Button>
        </div>
      </div>
      <div className="mt-16 md:mt-24 max-w-5xl mx-auto px-4">
        <div className="aspect-video rounded-lg overflow-hidden shadow-2xl element-glow-primary">
          <Image
            src="https://placehold.co/1280x720/CCCCCC/333333.png"
            alt="Dynamic Banner Showcasing Game Highlights"
            width={1280}
            height={720}
            className="w-full h-full object-cover"
            priority
            data-ai-hint="game highlights"
          />
        </div>
      </div>
    </section>
  );
}
