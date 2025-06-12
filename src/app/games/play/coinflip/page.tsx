
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Coins, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CoinflipPlayPage() {
  const [result, setResult] = useState<string | null>(null);
  const [flipping, setFlipping] = useState(false);

  const handleFlip = () => {
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const outcomes = ['Heads', 'Tails'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setResult(randomOutcome);
      setFlipping(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center space-y-8">
      <div className="w-full max-w-2xl">
        <Button variant="outline" asChild className="mb-6 border-primary text-primary hover:bg-primary/10 hover:text-primary self-start">
          <Link href="/games">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary text-glow-primary flex items-center justify-center">
            <Coins className="mr-3 h-8 w-8 text-accent" />
            Coinflip (Mock-up)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="w-36 h-36 bg-muted rounded-full flex items-center justify-center border-4 border-primary shadow-lg relative overflow-hidden">
            {flipping ? (
              <RefreshCw className="h-16 w-16 text-accent animate-spin" />
            ) : result ? (
              <p className="text-4xl font-bold text-accent">{result}</p>
            ) : (
               <Image src="https://placehold.co/144x144/CCCCCC/333333.png" alt="Coin" width={144} height={144} className="rounded-full" data-ai-hint="coin flip"/>
            )}
          </div>
          
          <Button onClick={handleFlip} disabled={flipping} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-lg py-3">
            {flipping ? 'Flipping...' : 'Flip Coin'}
          </Button>

           {result && !flipping && (
            <p className="text-xl text-muted-foreground">The coin landed on: <span className="font-bold text-primary">{result}</span></p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            This is a simplified mock-up. No real betting involved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
