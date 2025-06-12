
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, HelpCircle, Gem, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useJackpot } from '@/context/JackpotContext'; // Import useJackpot

interface Winner {
  username: string;
  amount: number;
  date: string;
  avatarSeed: string;
}

const pastWinners: Winner[] = [
  { username: 'LuckyLeo', amount: 15780, date: '2024-07-15', avatarSeed: 'LL' },
  { username: 'JackpotJane', amount: 22300, date: '2024-06-28', avatarSeed: 'JJ' },
  { username: 'WinnerWinner', amount: 9850, date: '2024-06-10', avatarSeed: 'WW' },
];

export default function ProgressiveJackpotPage() {
  const { jackpotAmount } = useJackpot(); // Use jackpotAmount from context

  return (
    <div className="space-y-12">
      <div className="text-center">
        <Gem className="mx-auto h-16 w-16 text-accent mb-4 element-glow-accent animate-pulse" />
        <h1 className="text-4xl font-bold text-primary text-glow-primary">Progressive Jackpot</h1>
        <p className="text-muted-foreground mt-2">The GamblrNation grand prize pool is growing every second! Are you the next big winner?</p>
      </div>

      <Card className="max-w-2xl mx-auto text-center glass-card element-glow-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Current Jackpot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl md:text-7xl font-bold text-accent jackpot-glow flex items-center justify-center">
            <DollarSign className="h-10 w-10 md:h-14 md:w-14 mr-2"/>
            {jackpotAmount.toLocaleString()}
          </p>
          <p className="text-muted-foreground mt-2">GamblrCoins</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <HelpCircle className="mr-3 h-6 w-6" /> How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/80">
            <p>The GamblrNation Progressive Jackpot grows continuously as players engage in specific games and activities across the platform.</p>
            <p>A small percentage of certain wagers or entry fees contributes to the jackpot pool, making it bigger and bigger until one lucky player hits it big!</p>
            <p><strong>How to Win:</strong> Eligibility and winning conditions vary by game. Typically, hitting a rare combination, achieving a specific score, or winning a special event in participating games can trigger a jackpot win. Check individual game rules for details.</p>
            <p>The jackpot can be won at any time, by any eligible player. Good luck!</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <Trophy className="mr-3 h-6 w-6" /> Past Winners
            </CardTitle>
            <CardDescription>Celebrating our lucky jackpot champions!</CardDescription>
          </CardHeader>
          <CardContent>
            {pastWinners.length > 0 ? (
              <ul className="space-y-4">
                {pastWinners.map((winner, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-md hover:bg-primary/10">
                    <div className="flex items-center space-x-3">
                       <Avatar className="h-10 w-10">
                         <AvatarImage src={`https://placehold.co/40x40/CCCCCC/333333.png`} alt={winner.username} data-ai-hint="player avatar"/>
                         <AvatarFallback className="bg-primary text-primary-foreground">{winner.avatarSeed}</AvatarFallback>
                       </Avatar>
                      <div>
                        <p className="font-semibold text-accent">{winner.username}</p>
                        <p className="text-xs text-muted-foreground">Won on: {winner.date}</p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-yellow-400">
                      {winner.amount.toLocaleString()} <span className="text-xs">Coins</span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No past winners to display yet. You could be the first!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
