// src/hooks/useKadiDeck.js
import { useState, useCallback } from 'react';
import { createDeck, shuffleDeck, isValidStarter } from '../utils/gameLogic';

const useKadiDeck = () => {
  const [deck, setDeck] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);

  // Setup initial game state
  const initializeGame = useCallback(() => {
    let newDeck = createDeck();
    const pHand = newDeck.splice(0, 4);
    const cHand = newDeck.splice(0, 4);
    
    let startCard = newDeck.shift();
    while (!isValidStarter(startCard)) {
      newDeck.push(startCard);
      startCard = newDeck.shift();
    }

    setDeck(newDeck);
    setDiscardPile([startCard]);
    return { pHand, cHand, startCard };
  }, []);

  // Reshuffle logic
  const checkReshuffle = useCallback(() => {
    if (deck.length === 0) {
      if (discardPile.length <= 1) return null; // Cannot shuffle
      const topCard = discardPile[0];
      const newDeck = shuffleDeck(discardPile.slice(1));
      setDiscardPile([topCard]);
      setDeck(newDeck);
      return newDeck;
    }
    return deck;
  }, [deck, discardPile]);

  return { 
    deck, setDeck, 
    discardPile, setDiscardPile, 
    initializeGame, checkReshuffle 
  };
};

export default useKadiDeck;