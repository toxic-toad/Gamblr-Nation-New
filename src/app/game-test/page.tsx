
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Beaker, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TestGame {
  id: string;
  title: string;
  status: 'Alpha' | 'Beta' | 'Released Candidate';
  description: string;
  imageHint: string; // Removed image, will use placeholder
  version: string;
  feedbackLink?: string;
}

const testGames: TestGame[] = [
  { id: 'tg1', title: 'Project Chimera', status: 'Alpha', description: 'A genre-bending tactical RPG with experimental mechanics. Provide feedback on core gameplay loops.', imageHint: "fantasy creature", version: '0.1.5a' },
  { id: 'tg2', title: 'Void Runner Arena', status: 'Beta', description: 'Fast-paced multiplayer shooter with unique movement abilities. Focus testing on map balance and netcode.', imageHint: "sci-fi arena", version: '0.7.2b', feedbackLink: '#' },
  { id: 'tg3', title: 'PuzzleVerse', status: 'Released Candidate', description: 'A mind-bending puzzle adventure with interconnected worlds. Final checks for bugs and polish.', imageHint: "abstract puzzle", version: '0.9.9rc' },
];

export default function GameTestPage() {
  const { toast } = useToast();

  const handlePlayTest = (gameTitle: string) => {
    toast({
      title: `Launching ${gameTitle} (Test Build)...`,
      description: "This is a mock interaction. In a real scenario, the test game client would launch.",
      variant: "default",
    });
  };
  
  const getStatusColor = (status: TestGame['status']) => {
    if (status === 'Alpha') return 'text-red-400 border-red-400';
    if (status === 'Beta') return 'text-yellow-400 border-yellow-400';
    return 'text-green-400 border-green-400';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Beaker className="mx-auto h-16 w-16 text-accent mb-4 element-glow-accent" />
        <h1 className="text-4xl font-bold text-primary text-glow-primary">Game Test Zone</h1>
        <p className="text-muted-foreground mt-2">Help us shape the future of GamblrNation! Play test upcoming games and provide valuable feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testGames.map(game => (
          <Card key={game.id} className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 glass-card flex flex-col">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image src="https://placehold.co/600x400/CCCCCC/333333.png" alt={game.title} layout="fill" objectFit="cover" data-ai-hint={game.imageHint}/>
                 <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-md border bg-card/70 backdrop-blur-sm ${getStatusColor(game.status)}`}>
                    {game.status} - v{game.version}
                  </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-2xl text-primary mb-2">{game.title}</CardTitle>
              <CardDescription className="text-sm text-foreground/80 mb-4 h-20 overflow-hidden text-ellipsis">{game.description}</CardDescription>
               {game.status === 'Alpha' && 
                <p className="text-xs text-red-400 flex items-center mb-2"><AlertTriangle className="h-4 w-4 mr-1"/> Expect bugs and incomplete features.</p>
              }
              {game.status === 'Beta' && 
                <p className="text-xs text-yellow-400 flex items-center mb-2"><AlertTriangle className="h-4 w-4 mr-1"/> Nearing completion, some bugs may exist.</p>
              }
               {game.status === 'Released Candidate' && 
                <p className="text-xs text-green-400 flex items-center mb-2"><CheckCircle className="h-4 w-4 mr-1"/> Almost ready for launch!</p>
              }
            </CardContent>
            <CardFooter className="p-4 pt-0 mt-auto space-y-2">
              <Button onClick={() => handlePlayTest(game.title)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent">
                <Play className="mr-2 h-4 w-4" /> Play Test
              </Button>
              {game.feedbackLink && (
                <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary">
                  <a href={game.feedbackLink} target="_blank" rel="noopener noreferrer">Provide Feedback</a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
       {testGames.length === 0 && (
        <Card className="text-center py-12 glass-card">
          <CardHeader>
            <Beaker className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Test Games Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Check back soon for new games to test!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
