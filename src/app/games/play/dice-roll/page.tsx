
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Dices, RefreshCw, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import Link from 'next/link';

const DiceIcon = ({ value }: { value: number }) => {
  switch (value) {
    case 1: return <Dice1 className="h-16 w-16 text-accent" />;
    case 2: return <Dice2 className="h-16 w-16 text-accent" />;
    case 3: return <Dice3 className="h-16 w-16 text-accent" />;
    case 4: return <Dice4 className="h-16 w-16 text-accent" />;
    case 5: return <Dice5 className="h-16 w-16 text-accent" />;
    case 6: return <Dice6 className="h-16 w-16 text-accent" />;
    default: return <Dices className="h-16 w-16 text-accent" />;
  }
};

export default function DiceRollPlayPage() {
  const [dice1, setDice1] = useState<number | null>(null);
  const [dice2, setDice2] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    setRolling(true);
    setDice1(null);
    setDice2(null);
    setTimeout(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      setRolling(false);
    }, 1500);
  };

  const total = (dice1 ?? 0) + (dice2 ?? 0);

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
            <Dices className="mr-3 h-8 w-8 text-accent" />
            Dice Roll (Mock-up)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex space-x-4 p-4 bg-muted rounded-lg border border-primary shadow-md min-h-[120px] items-center justify-center">
            {rolling ? (
              <RefreshCw className="h-16 w-16 text-accent animate-spin" />
            ) : dice1 && dice2 ? (
              <>
                <DiceIcon value={dice1} />
                <DiceIcon value={dice2} />
              </>
            ) : (
              <p className="text-xl text-muted-foreground">Roll the Dice!</p>
            )}
          </div>
          
          <Button onClick={handleRoll} disabled={rolling} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-lg py-3">
            {rolling ? 'Rolling...' : 'Roll Dice'}
          </Button>

          {dice1 && dice2 && !rolling && (
            <p className="text-xl text-muted-foreground">
              You rolled: <span className="font-bold text-primary">{dice1}</span> and <span className="font-bold text-primary">{dice2}</span>. Total: <span className="font-bold text-accent">{total}</span>
            </p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            This is a simplified mock-up. No real betting involved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
