
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Spade, RefreshCw, Ban, Check } from 'lucide-react';
import Link from 'next/link';

interface PlayingCard {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string; // 'A', '2', '3', ..., '10', 'J', 'Q', 'K'
  value: number;
}

const suits: Array<'♠' | '♥' | '♦' | '♣'> = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): PlayingCard[] => {
  const deck: PlayingCard[] = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      let value = parseInt(rank);
      if (rank === 'A') value = 11;
      else if (['J', 'Q', 'K'].includes(rank)) value = 10;
      deck.push({ suit, rank, value });
    });
  });
  return deck.sort(() => Math.random() - 0.5); // Shuffle
};

const calculateHandValue = (hand: PlayingCard[]): number => {
  let value = hand.reduce((sum, card) => sum + card.value, 0);
  let aceCount = hand.filter(card => card.rank === 'A').length;
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
};

const CardDisplay = ({ card, hidden }: { card?: PlayingCard, hidden?: boolean }) => {
  if (hidden || !card) {
    return <div className="w-16 h-24 bg-primary rounded-md flex items-center justify-center text-primary-foreground shadow-md border-2 border-primary-foreground/50">?</div>;
  }
  const color = (card.suit === '♥' || card.suit === '♦') ? 'text-red-500' : 'text-foreground';
  return (
    <div className={`w-16 h-24 bg-card rounded-md flex flex-col items-center justify-center p-1 shadow-md border-2 border-primary/30 ${color}`}>
      <span className="text-2xl font-bold">{card.rank}</span>
      <span className="text-xl">{card.suit}</span>
    </div>
  );
};

export default function BlackjackPlayPage() {
  const [deck, setDeck] = useState<PlayingCard[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
  const [dealerHand, setDealerHand] = useState<PlayingCard[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState<string | null>('Start the game or Hit/Stand.');
  const [dealerTurn, setDealerTurn] = useState(false);

  const dealCard = (currentDeck: PlayingCard[]): PlayingCard | undefined => currentDeck.pop();

  const startGame = () => {
    const newDeck = createDeck();
    const initialPlayerHand: PlayingCard[] = [];
    const initialDealerHand: PlayingCard[] = [];

    initialPlayerHand.push(dealCard(newDeck)!);
    initialDealerHand.push(dealCard(newDeck)!);
    initialPlayerHand.push(dealCard(newDeck)!);
    initialDealerHand.push(dealCard(newDeck)!);
    
    setDeck(newDeck);
    setPlayerHand(initialPlayerHand);
    setDealerHand(initialDealerHand);
    setGameOver(false);
    setMessage('Your turn. Hit or Stand?');
    setDealerTurn(false);
  };

  useEffect(() => {
    startGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPlayerScore(calculateHandValue(playerHand));
    setDealerScore(calculateHandValue(dealerHand));
  }, [playerHand, dealerHand]);

  useEffect(() => {
    if (playerScore > 21) {
      setMessage('Player Busts! Dealer Wins.');
      setGameOver(true);
    } else if (playerScore === 21 && playerHand.length === 2) {
      setMessage('Blackjack! Player Wins!');
      setGameOver(true);
    }
  }, [playerScore, playerHand.length]);
  
  useEffect(() => {
    if (dealerTurn && !gameOver) {
      let currentDealerHand = [...dealerHand];
      let currentDealerScore = calculateHandValue(currentDealerHand);
      const currentDeck = [...deck];

      while (currentDealerScore < 17 && currentDeck.length > 0) {
        const newCard = dealCard(currentDeck);
        if (newCard) {
          currentDealerHand.push(newCard);
          currentDealerScore = calculateHandValue(currentDealerHand);
        } else {
          break; 
        }
      }
      setDealerHand(currentDealerHand);
      setDeck(currentDeck); // Update deck state

      const finalPlayerScore = calculateHandValue(playerHand); // Recalculate just in case
      setDealerScore(currentDealerScore); // Update dealer score state

      if (currentDealerScore > 21) {
        setMessage('Dealer Busts! Player Wins.');
      } else if (currentDealerScore > finalPlayerScore) {
        setMessage('Dealer Wins.');
      } else if (finalPlayerScore > currentDealerScore) {
        setMessage('Player Wins!');
      } else {
        setMessage('Push! It\'s a Tie.');
      }
      setGameOver(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerTurn, gameOver]);


  const handleHit = () => {
    if (gameOver || deck.length === 0) return;
    const newCard = dealCard([...deck]); // Create a copy to modify
    if (newCard) {
      setPlayerHand(prev => [...prev, newCard]);
      setDeck(prev => prev.slice(0, -1)); // Remove the dealt card from original deck state
    }
  };

  const handleStand = () => {
    if (gameOver) return;
    setDealerTurn(true); // Trigger dealer's turn
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center space-y-6">
      <div className="w-full max-w-2xl">
        <Button variant="outline" asChild className="mb-4 border-primary text-primary hover:bg-primary/10 hover:text-primary self-start">
          <Link href="/games">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-xl glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary text-glow-primary flex items-center justify-center">
            <Spade className="mr-3 h-8 w-8 text-accent" />
            Blackjack (Mock-up)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          
          {/* Dealer's Hand */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-accent mb-2 text-center">Dealer's Hand ({!dealerTurn && !gameOver ? '?' : dealerScore})</h3>
            <div className="flex justify-center space-x-2 min-h-[104px]">
              {dealerHand.map((card, index) => (
                <CardDisplay key={index} card={card} hidden={index === 1 && !dealerTurn && !gameOver} />
              ))}
            </div>
          </div>

          {/* Player's Hand */}
           <div className="w-full">
            <h3 className="text-lg font-semibold text-accent mb-2 text-center">Your Hand ({playerScore})</h3>
            <div className="flex justify-center space-x-2 min-h-[104px]">
              {playerHand.map((card, index) => (
                <CardDisplay key={index} card={card} />
              ))}
              {playerHand.length === 0 && <p className="text-muted-foreground">Dealing...</p>}
            </div>
          </div>
          
          {message && (
            <p className={`text-xl text-center font-semibold ${gameOver ? (message.includes("Win") ? "text-green-400" : "text-red-400") : "text-muted-foreground"}`}>
              {message}
            </p>
          )}

          <div className="flex space-x-4">
            <Button onClick={handleHit} disabled={gameOver || playerScore > 21 || dealerTurn} className="bg-green-500 hover:bg-green-600 text-white">
              <Check className="mr-2 h-5 w-5" /> Hit
            </Button>
            <Button onClick={handleStand} disabled={gameOver || playerScore > 21 || dealerTurn} className="bg-red-500 hover:bg-red-600 text-white">
              <Ban className="mr-2 h-5 w-5" /> Stand
            </Button>
          </div>
          
          <Button onClick={startGame} variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <RefreshCw className="mr-2 h-4 w-4" /> New Game / Reset
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            This is a simplified mock-up. No real betting involved. Aces are 11 unless bust. Dealer hits on 16 or less.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
