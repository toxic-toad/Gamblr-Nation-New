
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Landmark, RefreshCw, Gem, Cherry, Annoyed } from 'lucide-react'; // Used Annoyed for Lemon
import Link from 'next/link';

const slotSymbols = [
  { icon: <Cherry className="h-12 w-12 text-red-500" />, name: 'Cherry' },
  { icon: <Gem className="h-12 w-12 text-blue-500" />, name: 'Gem' },
  { icon: <Annoyed className="h-12 w-12 text-yellow-500" />, name: 'Lemon' }, // Using Annoyed for Lemon
  { icon: <Landmark className="h-12 w-12 text-purple-500" />, name: 'Bar' },
];

export default function SlotsPlayPage() {
  const [reels, setReels] = useState<(React.ReactNode | null)[]>([null, null, null]);
  const [reelNames, setReelNames] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>("Pull the lever!");

  const getRandomSymbol = () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)];

  const handleSpin = () => {
    setSpinning(true);
    setMessage(null);
    
    // Animate reels
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels([getRandomSymbol().icon, getRandomSymbol().icon, getRandomSymbol().icon]);
      spinCount++;
      if (spinCount > 10) { // Stop animation after a bit
        clearInterval(spinInterval);
        
        // Determine final result
        const finalReelSymbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        setReels(finalReelSymbols.map(s => s.icon));
        setReelNames(finalReelSymbols.map(s => s.name));
        setSpinning(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (!spinning && reelNames.length === 3) {
      if (reelNames[0] === reelNames[1] && reelNames[1] === reelNames[2]) {
        setMessage(`Jackpot! Three ${reelNames[0]}s!`);
      } else if (reelNames[0] === reelNames[1] || reelNames[1] === reelNames[2] || reelNames[0] === reelNames[2]) {
        setMessage("Nice! Two matched!");
      } else {
        setMessage("No win this time. Try again!");
      }
    }
  }, [spinning, reelNames]);


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
            <Landmark className="mr-3 h-8 w-8 text-accent" />
            Slots (Mock-up)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex space-x-2 p-4 bg-muted rounded-lg border-2 border-primary shadow-inner">
            {reels.map((symbol, index) => (
              <div key={index} className="w-20 h-20 bg-background rounded flex items-center justify-center border border-primary/50">
                {symbol || <RefreshCw className="h-10 w-10 text-muted-foreground" />}
              </div>
            ))}
          </div>
          
          <Button onClick={handleSpin} disabled={spinning} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-lg py-3">
            {spinning ? 'Spinning...' : 'Pull Lever'}
          </Button>

          {message && !spinning && (
            <p className="text-xl text-center text-muted-foreground">{message}</p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            This is a simplified mock-up. No real betting involved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

