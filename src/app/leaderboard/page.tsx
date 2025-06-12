
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, ShieldAlert, CalendarDays, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Player {
  rank: number;
  username: string;
  score: number;
  avatarSeed: string; 
  gamesPlayed?: number;
  winRate?: string;
}

const weeklyLeaderboard: Player[] = [
  { rank: 1, username: 'ShadowStrikerX', score: 12500, avatarSeed: 'SSX', gamesPlayed: 50, winRate: '75%' },
  { rank: 2, username: 'MysticMaven', score: 11800, avatarSeed: 'MM', gamesPlayed: 45, winRate: '70%' },
  { rank: 3, username: 'CosmicDrifter', score: 10500, avatarSeed: 'CD', gamesPlayed: 60, winRate: '60%' },
  { rank: 4, username: 'NeonNinja', score: 9800, avatarSeed: 'NN', gamesPlayed: 40, winRate: '80%' },
  { rank: 5, username: 'PixelPioneer', score: 9200, avatarSeed: 'PP', gamesPlayed: 55, winRate: '65%' },
];

const allTimeLeaderboard: Player[] = [
  { rank: 1, username: 'LegendGamer001', score: 250000, avatarSeed: 'LG', gamesPlayed: 1200, winRate: '82%' },
  { rank: 2, username: 'ShadowStrikerX', score: 235000, avatarSeed: 'SSX', gamesPlayed: 1100, winRate: '78%' },
  { rank: 3, username: 'MysticMaven', score: 210000, avatarSeed: 'MM', gamesPlayed: 1000, winRate: '72%' },
  { rank: 4, username: 'TheOracle', score: 195000, avatarSeed: 'TO', gamesPlayed: 950, winRate: '75%' },
  { rank: 5, username: 'CosmicDrifter', score: 180000, avatarSeed: 'CD', gamesPlayed: 1050, winRate: '68%' },
  { rank: 6, username: 'PixelPioneer', score: 175000, avatarSeed: 'PP', gamesPlayed: 900, winRate: '70%' },
  { rank: 7, username: 'NeonNinja', score: 160000, avatarSeed: 'NN', gamesPlayed: 850, winRate: '76%' },
];

const LeaderboardTable = ({ players, type }: { players: Player[]; type: 'weekly' | 'all-time' }) => (
  <Card className="glass-card">
    <CardContent className="p-0">
      {players.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center text-primary">Rank</TableHead>
              <TableHead className="text-primary">Player</TableHead>
              <TableHead className="text-right text-primary">Score</TableHead>
              {type === 'all-time' && <TableHead className="text-right text-primary hidden md:table-cell">Games Played</TableHead>}
              {type === 'all-time' && <TableHead className="text-right text-primary hidden md:table-cell">Win Rate</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={player.username} className={index < 3 ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium text-center">
                  {player.rank === 1 && <Crown className="h-5 w-5 text-yellow-400 inline-block mr-1" />}
                  {player.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://placehold.co/40x40/CCCCCC/333333.png" alt={player.username} data-ai-hint="player avatar"/>
                      <AvatarFallback className={player.rank <= 3 ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}>{player.avatarSeed}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground/90">{player.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-accent">{player.score.toLocaleString()}</TableCell>
                {type === 'all-time' && <TableCell className="text-right hidden md:table-cell text-muted-foreground">{player.gamesPlayed?.toLocaleString()}</TableCell>}
                {type === 'all-time' && <TableCell className="text-right hidden md:table-cell text-muted-foreground">{player.winRate}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
         <div className="text-center py-12">
            <ShieldAlert className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Leaderboard data is currently unavailable. Please check back later.</p>
          </div>
      )}
    </CardContent>
  </Card>
);

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Trophy className="mx-auto h-16 w-16 text-yellow-400 mb-4 element-glow-accent" />
        <h1 className="text-4xl font-bold text-primary text-glow-primary">Leaderboards</h1>
        <p className="text-muted-foreground mt-2">See who's dominating the GamblrNation!</p>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto bg-card/50 border border-primary/30">
          <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
            <CalendarDays className="mr-2 h-5 w-5"/> Weekly Top
          </TabsTrigger>
          <TabsTrigger value="all-time" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
            <Users className="mr-2 h-5 w-5"/> All-Time Legends
          </TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="mt-6">
          <LeaderboardTable players={weeklyLeaderboard} type="weekly" />
        </TabsContent>
        <TabsContent value="all-time" className="mt-6">
          <LeaderboardTable players={allTimeLeaderboard} type="all-time" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
