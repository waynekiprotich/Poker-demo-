// src/utils/gameLogic.js

const SUITS = ["H", "D", "C", "S"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"];

// --- 1. CARD CREATION ---
export const createDeck = () => {
  let deck = [];
  for (let suit of SUITS) {
    for (let rank of RANKS) {
      deck.push({
        code: rank + suit,
        value: rank,
        suit: suit,
        image: `https://deckofcardsapi.com/static/img/${rank}${suit}.png`,
        isJoker: false
      });
    }
  }
  deck.push({ code: "J1", value: "JOKER", suit: "NONE", image: "https://deckofcardsapi.com/static/img/X1.png", isJoker: true });
  deck.push({ code: "J2", value: "JOKER", suit: "NONE", image: "https://deckofcardsapi.com/static/img/X2.png", isJoker: true });
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck) => {
  let newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

// --- 2. CARD ROLES ---
export const isJumpCard = (c) => c.value === "J";
export const isQuestionCard = (c) => c.value === "Q" || c.value === "8";
export const isKickbackCard = (c) => c.value === "K";
export const isAnswerCard = (c) => ["4", "5", "6", "7", "9", "0", "A"].includes(c.value);
export const isPenaltyCard = (c) => c.value === "2" || c.value === "3" || c.isJoker;
export const isAce = (c) => c.value === "A";

export const getPenaltyValue = (c) => {
  if (c.value === "2") return 2;
  if (c.value === "3") return 3;
  if (c.isJoker) return 5;
  return 0;
};

// --- 3. VALIDATION ---
export const isValidStarter = (card) => {
  if (isPenaltyCard(card) || isQuestionCard(card) || isKickbackCard(card) || isJumpCard(card) || isAce(card)) return false;
  return true;
};

export const validateMove = (playedCard, topCard, currentSuit, penaltyStack = 0) => {
  if (!playedCard || !topCard) return false;

  // Penalty Stacking Logic
  if (penaltyStack > 0) {
    if (isPenaltyCard(playedCard) && playedCard.value === topCard.value) return true;
    if (isAce(playedCard)) return true; 
    return false;
  }

  // Standard Matching
  if (playedCard.isJoker) return true;
  if (isAce(playedCard)) return true;
  if (playedCard.suit === currentSuit) return true;
  if (playedCard.value === topCard.value) return true;

  return false;
};

// --- 4. AI LOGIC ---
export const findValidMove = (hand, topCard, currentSuit, penaltyStack) => {
  // Priority 1: Handle Penalty
  if (penaltyStack > 0) {
    return hand.findIndex(c => (isPenaltyCard(c) && c.value === topCard.value) || isAce(c));
  }
  
  // Priority 2: Win with Answer Card
  if (hand.length === 1 && isAnswerCard(hand[0])) {
    if (validateMove(hand[0], topCard, currentSuit, 0)) return 0;
  }

  // Priority 3: Play Question Card (Aggressive)
  const qIndex = hand.findIndex(c => isQuestionCard(c) && validateMove(c, topCard, currentSuit, 0));
  if (qIndex !== -1) return qIndex;

  // Priority 4: Any Valid Move
  return hand.findIndex(c => validateMove(c, topCard, currentSuit, 0));
};