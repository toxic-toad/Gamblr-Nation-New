
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface JackpotContextType {
  jackpotAmount: number;
}

const JackpotContext = createContext<JackpotContextType | undefined>(undefined);

const INITIAL_JACKPOT_AMOUNT = 50000; 

export function JackpotProvider({ children }: { children: ReactNode }) {
  const [jackpotAmount, setJackpotAmount] = useState(INITIAL_JACKPOT_AMOUNT);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate jackpot increasing
      setJackpotAmount(prevAmount => prevAmount + Math.floor(Math.random() * 10) + 1);
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <JackpotContext.Provider value={{ jackpotAmount }}>
      {children}
    </JackpotContext.Provider>
  );
}

export function useJackpot() {
  const context = useContext(JackpotContext);
  if (context === undefined) {
    throw new Error('useJackpot must be used within a JackpotProvider');
  }
  return context;
}
