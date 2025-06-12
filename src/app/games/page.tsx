
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Zap, Dices, CircleDot, CoinsIcon as CoinflipIcon, Landmark, Spade } from 'lucide-react';

const allGames = [
  { id: 'roulette', title: 'Roulette', genre: 'Casino', rating: 4.3, imageHint: "roulette casino", description: "Spin the wheel and try your luck!" },
  { id: 'coinflip', title: 'Coinflip', genre: 'Casino', rating: 4.0, imageHint: "flipping coin", description: "Heads or Tails? Make your choice." },
  { id: 'dice-roll', title: 'Dice Roll', genre: 'Casino', rating: 4.1, imageHint: "dice game", description: "Roll the dice and see what you get." },
  { id: 'slots', title: 'Slots', genre: 'Casino', rating: 4.2, imageHint: "slot machine", description: "Spin the reels for a chance to win big!" },
  { id: 'blackjack', title: 'Blackjack', genre: 'Casino', rating: 4.5, imageHint: "blackjack cards", description: "Try to beat the dealer and get 21." },
];

const genres = ['All', 'Casino']; 
const sortOptions = [
  { value: 'title_asc', label: 'Title (A-Z)' },
  { value: 'title_desc', label: 'Title (Z-A)' },
  { value: 'rating_desc', label: 'Rating (High-Low)' },
];

const gameIcons: { [key: string]: React.ElementType } = {
  Roulette: CircleDot,
  Coinflip: CoinflipIcon,
  'Dice Roll': Dices,
  Slots: Landmark,
  Blackjack: Spade,
};


export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('rating_desc');

  const filteredGames = allGames
    .filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(game => selectedGenre === 'All' || game.genre === selectedGenre)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'rating_desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary text-glow-primary">All Games</h1>

      <Card className="p-6 glass-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input text-foreground placeholder:text-muted-foreground"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <label htmlFor="genre-filter" className="block text-sm font-medium text-foreground mb-1">Filter by Genre</label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger id="genre-filter" className="w-full bg-input text-foreground">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre} className="hover:bg-primary/20 focus:bg-primary/30">{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-foreground mb-1">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by" className="w-full bg-input text-foreground">
                <SelectValue placeholder="Sort games" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-primary/20 focus:bg-primary/30">{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => {
            const GameIcon = gameIcons[game.title] || Zap;
            return (
            <Card key={game.id} className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 glass-card flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image src="https://placehold.co/600x400/CCCCCC/333333.png" alt={game.title} layout="fill" objectFit="cover" data-ai-hint={game.imageHint} />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-2xl text-primary mb-2 flex items-center">
                  <GameIcon className="mr-2 h-6 w-6 text-accent" />
                  {game.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-1">Genre: {game.genre}</CardDescription>
                <div className="flex items-center space-x-4 text-sm text-foreground/80 mb-3">
                  <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-400" /> {game.rating}/5.0</span>
                </div>
                <p className="text-foreground/80 text-sm mb-4 h-12 overflow-hidden text-ellipsis">{game.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                 <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground element-glow-accent">
                  <Link href={`/games/play/${game.id}`}> 
                    <Zap className="mr-2 h-4 w-4" /> Play Game
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        </div>
      ) : (
        <Card className="text-center py-12 glass-card">
          <CardHeader>
            <Filter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Games Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
