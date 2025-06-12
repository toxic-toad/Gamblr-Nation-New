
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CircleDotDashed, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const rouletteNumbers = [
  { number: 0, color: 'green' },
  { number: 32, color: 'red' }, { number: 15, color: 'black' }, { number: 19, color: 'red' }, { number: 4, color: 'black' },
  { number: 21, color: 'red' }, { number: 2, color: 'black' }, { number: 25, color: 'red' }, { number: 17, color: 'black' },
  { number: 34, color: 'red' }, { number: 6, color: 'black' }, { number: 27, color: 'red' }, { number: 13, color: 'black' },
  { number: 36, color: 'red' }, { number: 11, color: 'black' }, { number: 30, color: 'red' }, { number: 8, color: 'black' },
  { number: 23, color: 'red' }, { number: 10, color: 'black' }, { number: 5, color: 'red' }, { number: 24, color: 'black' },
  { number: 16, color: 'red' }, { number: 33, color: 'black' }, { number: 1, color: 'red' }, { number: 20, color: 'black' },
  { number: 14, color: 'red' }, { number: 31, color: 'black' }, { number: 9, color: 'red' }, { number: 22, color: 'black' },
  { number: 18, color: 'red' }, { number: 29, color: 'black' }, { number: 7, color: 'red' }, { number: 28, color: 'black' },
  { number: 12, color: 'red' }, { number: 35, color: 'black' }, { number: 3, color: 'red' }, { number: 26, color: 'black' },
];

export default function RoulettePlayPage() {
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * rouletteNumbers.length);
      const winningNumber = rouletteNumbers[randomIndex];
      setResult(`Landed on: ${winningNumber.number} (${winningNumber.color.toUpperCase()})`);
      setSpinning(false);
    }, 2000);
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
            <CircleDotDashed className="mr-3 h-8 w-8 text-accent" />
            Roulette (Mock-up)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center border-4 border-primary shadow-lg">
            {spinning ? (
              <RefreshCw className="h-16 w-16 text-accent animate-spin" />
            ) : result ? (
              <div className="text-center">
                 <p className="text-lg text-muted-foreground">Result:</p>
                 <p className={`text-2xl font-bold ${
                    result.includes('RED') ? 'text-red-500' : result.includes('BLACK') ? 'text-foreground' : 'text-green-500'
                 }`}>
                    {result.split(': ')[1]?.split(' (')[0]}
                 </p>
                 <p className={`text-sm font-semibold ${
                    result.includes('RED') ? 'text-red-500' : result.includes('BLACK') ? 'text-muted-foreground' : 'text-green-500'
                 }`}>
                    ({result.split('(')[1]?.replace(')', '')})
                 </p>
              </div>
            ) : (
              <p className="text-xl text-muted-foreground">Spin the Wheel!</p>
            )}
          </div>
          
          <Button onClick={handleSpin} disabled={spinning} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent text-lg py-3">
            {spinning ? 'Spinning...' : 'Spin Wheel'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            This is a simplified mock-up. No real betting involved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
