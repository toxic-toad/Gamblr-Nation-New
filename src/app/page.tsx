
import HeroSection from '@/components/home/HeroSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Users, Trophy } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />

      <section className="container mx-auto px-4">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center text-primary text-glow-primary">
              What is GamblrNation?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-lg text-foreground/80 max-w-3xl mx-auto space-y-6">
            <p>
              GamblrNation is more than just a gaming platform; it's a vibrant community hub where passion for games, friendly competition, and a thriving marketplace converge. 
              We offer a diverse range of experiences, from engaging forums and exciting games to live streams and unique digital collectibles.
            </p>
            <p>
              Our mission is to create an immersive and interactive environment where every gamer feels at home, can showcase their skills, discover new adventures, and connect with like-minded individuals.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow-primary">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Gamepad2 className="h-10 w-10 text-accent" />}
            title="Diverse Games"
            description="Explore a wide variety of games, from classic favorites to new challenges."
            imageHint="gaming variety"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-accent" />}
            title="Active Community"
            description="Join discussions, share tips, and connect with fellow gamers in our forums."
            imageHint="gaming community"
          />
          <FeatureCard
            icon={<Trophy className="h-10 w-10 text-accent" />}
            title="Compete & Win"
            description="Climb the leaderboards, participate in events, and earn exclusive rewards."
            imageHint="gaming trophy"
          />
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageHint: string;
}

function FeatureCard({ icon, title, description, imageHint }: FeatureCardProps) {
  return (
    <Card className="text-center overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 glass-card">
      <CardHeader className="items-center">
        <div className="p-4 bg-accent/20 rounded-full mb-4 inline-block element-glow-accent">
          {icon}
        </div>
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
          <Image src="https://placehold.co/600x400/CCCCCC/333333.png" alt={title} layout="fill" objectFit="cover" data-ai-hint={imageHint} />
        </div>
        <p className="text-foreground/80">{description}</p>
      </CardContent>
    </Card>
  );
}
