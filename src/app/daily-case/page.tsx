
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Zap, Coins, Shield } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface Reward {
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic';
  icon: React.ReactNode;
  imageHint: string;
}

const possibleRewards: Reward[] = [
  { name: '100 GamblrCoins', rarity: 'Common', icon: <Coins className="h-8 w-8 text-yellow-400" />, imageHint: "coins stack" },
  { name: 'XP Boost (1 Hour)', rarity: 'Common', icon: <Zap className="h-8 w-8 text-blue-400" />, imageHint: "lightning bolt" },
  { name: 'Common Skin Shard', rarity: 'Uncommon', icon: <Shield className="h-8 w-8 text-gray-400" />, imageHint: "broken shield" },
  { name: '500 GamblrCoins', rarity: 'Uncommon', icon: <Coins className="h-8 w-8 text-yellow-500" />, imageHint: "many coins" },
  { name: 'Rare Profile Avatar', rarity: 'Rare', icon: <Gift className="h-8 w-8 text-purple-500" />, imageHint: "special avatar" },
  { name: 'Epic Weapon Skin', rarity: 'Epic', icon: <Shield className="h-8 w-8 text-orange-500" />, imageHint: "epic sword" },
];

const getRarityColor = (rarity: Reward['rarity']) => {
  switch (rarity) {
    case 'Epic': return 'text-orange-500 border-orange-500 shadow-orange-500/50';
    case 'Rare': return 'text-purple-500 border-purple-500 shadow-purple-500/50';
    case 'Uncommon': return 'text-blue-400 border-blue-400 shadow-blue-400/50';
    default: return 'text-gray-400 border-gray-400 shadow-gray-400/50';
  }
};


export default function DailyCasePage() {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedReward, setRevealedReward] = useState<Reward | null>(null);
  const [canClaim, setCanClaim] = useState(true); 

  useEffect(() => {
    const lastClaimed = localStorage.getItem('dailyCaseLastClaimed');
    if (lastClaimed) {
      const lastClaimDate = new Date(lastClaimed);
      const today = new Date();
      if (lastClaimDate.toDateString() === today.toDateString()) {
        setCanClaim(false);
      }
    }
  }, []);

  const handleSpin = () => {
    if (!canClaim) {
      toast({ title: "Already Claimed!", description: "You've already claimed your daily case today. Come back tomorrow!", variant: "destructive" });
      return;
    }
    setIsSpinning(true);
    setRevealedReward(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * possibleRewards.length);
      const reward = possibleRewards[randomIndex];
      setRevealedReward(reward);
      setIsSpinning(false);
      setCanClaim(false); 
      localStorage.setItem('dailyCaseLastClaimed', new Date().toISOString()); 
      toast({ title: "Reward Claimed!", description: `You got: ${reward.name} (${reward.rarity})`, variant: "default" });
    }, 2000); 
  };

  return (
    <div className="text-center space-y-8">
      <Gift className="mx-auto h-16 w-16 text-accent mb-4 element-glow-accent" />
      <h1 className="text-4xl font-bold text-primary text-glow-primary">Daily Case</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Claim your free daily case for a chance to win awesome rewards! One claim per day.
      </p>

      <Card className="max-w-md mx-auto p-6 md:p-10 glass-card">
        <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
          <div className={cn(
            "relative w-48 h-48 md:w-64 md:h-64 perspective",
            isSpinning ? "animate-spin-y-once" : ""
          )}>
            <Image 
              src="https://placehold.co/256x256/CCCCCC/333333.png"
              alt={revealedReward ? revealedReward.name : "Daily Case"}
              width={256}
              height={256}
              className={cn(
                "rounded-lg object-cover shadow-2xl transition-all duration-500",
                isSpinning ? "opacity-50 scale-90" : "opacity-100 scale-100",
                revealedReward ? `border-4 ${getRarityColor(revealedReward.rarity)} shadow-lg` : 'border-4 border-primary element-glow-primary'
              )}
              data-ai-hint={revealedReward ? revealedReward.imageHint : "mystery box"}
            />
          </div>
          
          {revealedReward && !isSpinning && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">You won:</p>
              <h3 className={`text-2xl font-semibold ${getRarityColor(revealedReward.rarity)}`}>{revealedReward.name}</h3>
              <p className={`text-sm font-medium ${getRarityColor(revealedReward.rarity)}`}>({revealedReward.rarity})</p>
            </div>
          )}

          {!canClaim && !revealedReward && (
             <p className="text-lg text-accent font-semibold">You've already claimed your case today. Come back tomorrow!</p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSpin} 
            disabled={isSpinning || !canClaim} 
            className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent disabled:opacity-70"
          >
            {isSpinning ? 'Spinning...' : (canClaim ? 'Claim Daily Case' : 'Claimed Today')}
          </Button>
        </CardFooter>
      </Card>
      
      {!canClaim && (
        <p className="text-muted-foreground mt-4">
          Next claim available tomorrow.
        </p>
      )}
    </div>
  );
}
