
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Tag, Search, Filter, ShieldCheck, Gem, Coins } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MarketItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageHint: string; 
  description: string;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  stock?: number;
}

const marketItems: MarketItem[] = [
  { id: '1', name: 'Cosmic Guardian Skin', category: 'Skins', price: 1200, imageHint: "space armor", description: "Stand out with this legendary cosmic guardian armor set.", rarity: 'Legendary', stock: 10 },
  { id: '2', name: 'Neon Edge Weapon Skin', category: 'Skins', price: 800, imageHint: "glowing sword", description: "A sleek, glowing weapon skin for your favorite blade.", rarity: 'Epic', stock: 25 },
  { id: '3', name: '1000 GamblrCoins', category: 'Coins', price: 10, imageHint: "gold coins", description: "Get 1000 GamblrCoins to spend in-game or on the marketplace.", rarity: 'Common' },
  { id: '4', name: 'Rare Loot Crate', category: 'Loot Box', price: 500, imageHint: "treasure chest", description: "Contains a random assortment of rare items.", rarity: 'Rare', stock: 50 },
  { id: '5', name: 'Profile Banner - Nebula', category: 'Profile Customization', price: 300, imageHint: "space nebula", description: "Customize your profile with this stunning nebula banner.", rarity: 'Uncommon' },
  { id: '6', name: 'XP Boost (7 Days)', category: 'Boosters', price: 750, imageHint: "xp boost", description: "Double your experience points for 7 days.", rarity: 'Uncommon', stock: 100 },
];

const categories = ['All', 'Skins', 'Coins', 'Loot Box', 'Profile Customization', 'Boosters'];
const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

export default function MarketplacePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');

  const filteredItems = marketItems
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
    .filter(item => selectedRarity === 'All' || item.rarity === selectedRarity);

  const handleAddToCart = (itemName: string) => {
    toast({
      title: `${itemName} added to cart!`,
      description: "Proceed to checkout to complete your purchase.",
      variant: "default",
      action: <Button variant="outline" size="sm" onClick={() => console.log("View Cart")}>View Cart</Button>
    });
  };
  
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 border-yellow-400';
      case 'Epic': return 'text-purple-400 border-purple-400';
      case 'Rare': return 'text-blue-400 border-blue-400';
      case 'Uncommon': return 'text-green-400 border-green-400';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary text-glow-primary">Marketplace</h1>

      <Card className="p-6 glass-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input text-foreground placeholder:text-muted-foreground"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-foreground mb-1">Filter by Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-filter" className="w-full bg-input text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="hover:bg-primary/20 focus:bg-primary/30">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div>
            <label htmlFor="rarity-filter" className="block text-sm font-medium text-foreground mb-1">Filter by Rarity</label>
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger id="rarity-filter" className="w-full bg-input text-foreground">
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                {rarities.map(rar => (
                  <SelectItem key={rar} value={rar} className="hover:bg-primary/20 focus:bg-primary/30">{rar}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 glass-card flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full">
                  <Image src="https://placehold.co/600x400/CCCCCC/333333.png" alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.imageHint}/>
                  {item.rarity && (
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-md border bg-card/70 backdrop-blur-sm ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-xl text-primary mb-1 truncate">{item.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mb-2 flex items-center">
                  <Tag className="h-3 w-3 mr-1"/> {item.category}
                  {item.stock && <span className="ml-auto text-xs">Stock: {item.stock}</span>}
                </CardDescription>
                <p className="text-foreground/80 text-sm mb-3 h-12 overflow-hidden text-ellipsis">{item.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                <div className="w-full flex flex-col items-start gap-2">
                    <p className="text-2xl font-bold text-accent flex items-center">
                        {item.category === 'Coins' ? <Coins className="h-6 w-6 mr-1.5 text-yellow-400"/> : <Gem className="h-5 w-5 mr-2 text-accent"/>} 
                        {item.price.toLocaleString()} 
                        <span className="text-sm ml-1">{item.category === 'Coins' ? '' : 'Credits'}</span>
                    </p>
                    <Button 
                        onClick={() => handleAddToCart(item.name)} 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground element-glow-primary"
                        disabled={item.stock !== undefined && item.stock <= 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> {item.stock !== undefined && item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <Card className="text-center py-12 glass-card">
          <CardHeader>
            <Filter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Items Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Try adjusting your search or filters, or check back later for new arrivals!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
