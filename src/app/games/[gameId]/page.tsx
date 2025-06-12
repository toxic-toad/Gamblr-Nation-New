
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Star, Zap, Dices, CircleDot, CoinsIcon as CoinflipIcon, Landmark, Spade } from 'lucide-react';

// Mock game data
const gameDetailsData: { [key: string]: any } = {
  roulette: { 
    id: 'roulette', 
    title: 'Roulette', 
    genre: 'Casino', 
    rating: 4.3, 
    imageHint: "roulette casino",
    description: "Spin the wheel and try your luck!", 
    longDescription: "Experience the thrill of the classic casino game, Roulette. Place your bets on your lucky numbers, colors, or sections of the wheel. Watch as the ball spins and hope it lands in your favor. This is a simplified mock version focusing on the spin and random outcome.",
    icon: CircleDot,
  },
  coinflip: { 
    id: 'coinflip', 
    title: 'Coinflip', 
    genre: 'Casino', 
    rating: 4.0, 
    imageHint: "flipping coin",
    description: "Heads or Tails? Make your choice.", 
    longDescription: "The simplest game of chance! Call heads or tails and see if fate is on your side. This mock-up simulates a coin flip with a random outcome.",
    icon: CoinflipIcon,
  },
  'dice-roll': { 
    id: 'dice-roll', 
    title: 'Dice Roll', 
    genre: 'Casino', 
    rating: 4.1, 
    imageHint: "dice game",
    description: "Roll the dice and see what you get.", 
    longDescription: "Roll one or more dice and see the outcome. A fundamental game of chance, perfect for quick fun. This version simulates rolling two standard six-sided dice.",
    icon: Dices,
  },
  slots: { 
    id: 'slots', 
    title: 'Slots', 
    genre: 'Casino', 
    rating: 4.2, 
    imageHint: "slot machine",
    description: "Spin the reels for a chance to win big!", 
    longDescription: "Try your luck with our classic slot machine mock-up. Spin the reels and match the symbols to get a (simulated) win. Features three reels with common slot symbols.",
    icon: Landmark,
  },
  blackjack: { 
    id: 'blackjack', 
    title: 'Blackjack', 
    genre: 'Casino', 
    rating: 4.5, 
    imageHint: "blackjack cards",
    description: "Try to beat the dealer and get 21.", 
    longDescription: "The classic card game of 21. Try to get closer to 21 than the dealer without going over. This is a very simplified mock-up allowing you to 'Hit' or 'Stand'.",
    icon: Spade,
  },
};

const getGameDetails = (gameId: string) => {
  return gameDetailsData[gameId] || null;
};


export default function GameDetailPage({ params }: { params: { gameId: string } }) {
  const game = getGameDetails(params.gameId);

  if (!game) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-destructive">Game Not Found</h1>
        <p className="text-muted-foreground mt-2">The game you are looking for does not exist or has been moved.</p>
        <Button asChild className="mt-6">
          <Link href="/games">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Link>
        </Button>
      </div>
    );
  }
  
  const GameIcon = game.icon || Zap;

  return (
    <div className="space-y-8">
       <Button variant="outline" asChild className="mb-2 border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/games">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Games
          </Link>
        </Button>

      <Card className="overflow-hidden glass-card">
        <CardHeader className="p-0 relative h-64 md:h-96">
          <Image src="https://placehold.co/800x450/CCCCCC/333333.png" alt={game.title} layout="fill" objectFit="cover" priority data-ai-hint={game.imageHint}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <CardTitle className="text-4xl md:text-5xl font-bold text-white text-glow-primary flex items-center">
              <GameIcon className="mr-3 h-10 w-10 text-accent" />
              {game.title}
            </CardTitle>
            <CardDescription className="text-lg text-primary-foreground/80">{game.genre}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4 text-md text-foreground/90 mb-6">
            <span className="flex items-center p-2 bg-primary/10 rounded-md"><Star className="h-5 w-5 mr-2 text-yellow-400" /> Rating: {game.rating}/5.0</span>
          </div>
          
          <h2 className="text-2xl font-semibold text-primary mb-3">About {game.title}</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">{game.longDescription || game.description}</p>
          
          <Button asChild size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-lg py-3 px-8">
            <Link href={`/games/play/${game.id}`}>
              <Zap className="mr-2 h-5 w-5" /> Play {game.title} (Mock-up)
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center md:text-left">(This will take you to a simple interactive mock-up of the game)</p>
        </CardContent>
      </Card>
    </div>
  );
}
