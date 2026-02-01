import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useKadiDeck from '../hooks/useKadiDeck';
import CurrentPlay from '../components/CurrentPlay';
import PlayerHand from '../components/PlayerHand';
import ComputerHand from '../components/ComputerHand';
import PlayButtons from '../components/PlayButtons';
import HomeButton from '../components/HomeButton';
import { 
  validateMove, findValidMove, isQuestionCard, isJumpCard, isKickbackCard, 
  isAnswerCard, isPenaltyCard, getPenaltyValue 
} from '../utils/gameLogic';

function GameBoard() {
  const { deck, setDeck, discardPile, setDiscardPile, initializeGame, checkReshuffle } = useKadiDeck();
  
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  
  // Game State
  const [gameMessage, setGameMessage] = useState("Welcome!");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [nikoKadiDeclared, setNikoKadiDeclared] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Refs for real-time tracking
  const stateRef = useRef({ 
    suit: null, 
    penalty: 0, 
    pendingQ: false 
  });

  useEffect(() => {
    const { pHand, cHand, startCard } = initializeGame();
    setPlayerHand(pHand);
    setComputerHand(cHand);
    stateRef.current.suit = startCard.suit;
    setGameMessage(`Match ${startCard.value} or ${startCard.suit}`);
  }, [initializeGame]);

  const updateGameState = (updates) => {
    if (updates.suit) stateRef.current.suit = updates.suit;
    if (updates.penalty !== undefined) stateRef.current.penalty = updates.penalty;
    if (updates.pendingQ !== undefined) stateRef.current.pendingQ = updates.pendingQ;
  };

  const handleNikoKadi = () => {
    if (playerHand.length <= 2) {
      setNikoKadiDeclared(true);
      setGameMessage("NIKO KADI DECLARED!");
    }
  };

  const handleCardClick = (index) => {
    if (!isPlayerTurn || gameOver) return;
    const card = playerHand[index];
    const topCard = discardPile[0];

    // Check Question Answer Rule
    if (stateRef.current.pendingQ) {
      if (!isAnswerCard(card) || !validateMove(card, topCard, stateRef.current.suit, 0)) {
        setGameMessage("Must play a matching ANSWER card!");
        return;
      }
      updateGameState({ pendingQ: false });
    }
    else if (!validateMove(card, topCard, stateRef.current.suit, stateRef.current.penalty)) {
      setGameMessage("Invalid Move!");
      return;
    }

    // Execute Move
    const newHand = [...playerHand];
    newHand.splice(index, 1);
    setPlayerHand(newHand);
    setDiscardPile([card, ...discardPile]);
    updateGameState({ suit: card.suit });

    // Win Check
    if (newHand.length === 0) {
      if (nikoKadiDeclared && isAnswerCard(card)) {
        setGameMessage("YOU WIN! NIKO KADI!");
        setGameOver(true);
      } else {
        setGameMessage("Invalid Win! Drawing penalty.");
        drawMultiple(1, newHand, true);
      }
      return;
    }

    // Special Effects
    let skipComp = false;
    if (isPenaltyCard(card)) {
      const val = getPenaltyValue(card);
      updateGameState({ penalty: stateRef.current.penalty + val });
      setGameMessage(`Penalty Stack: ${stateRef.current.penalty + val}`);
    } else if (isQuestionCard(card)) {
      setGameMessage("Question! Play Answer.");
      updateGameState({ pendingQ: true });
      return;
    } else if (isJumpCard(card) || isKickbackCard(card)) {
      setGameMessage("Skipped Computer!");
      skipComp = true;
    }

    if (!skipComp) {
      setIsPlayerTurn(false);
      setTimeout(computerTurn, 1500);
    }
  };

  const handleDraw = () => {
    if (!isPlayerTurn || gameOver) return;
    if (stateRef.current.pendingQ) {
      drawMultiple(1, playerHand, false);
      updateGameState({ pendingQ: false });
    } else {
      const count = stateRef.current.penalty || 1;
      drawMultiple(count, playerHand, false);
      updateGameState({ penalty: 0 });
    }
    setIsPlayerTurn(false);
    setTimeout(computerTurn, 1500);
  };

  const drawMultiple = (count, currentHand, keepTurn) => {
    let activeDeck = checkReshuffle();
    if (!activeDeck) return;
    let drawn = [];
    for(let i=0; i<count; i++) {
      if (activeDeck.length > 0) drawn.push(activeDeck.shift());
    }
    setDeck(activeDeck);
    setPlayerHand([...currentHand, ...drawn]);
    if (!keepTurn) setIsPlayerTurn(false);
  };

  // --- COMPUTER AI ---
  const computerTurn = () => {
    if (gameOver) return;

    setComputerHand(prevHand => {
      let newHand = [...prevHand];
      // Use functional update to access latest discard pile
      setDiscardPile(prevDiscard => {
        const top = prevDiscard[0];
        const moveIdx = findValidMove(newHand, top, stateRef.current.suit, stateRef.current.penalty);

        if (moveIdx !== -1) {
          const card = newHand[moveIdx];
          newHand.splice(moveIdx, 1);
          updateGameState({ suit: card.suit });
          setGameMessage(`Computer played ${card.value}${card.suit}`);
          
          if (newHand.length === 0) {
            setGameMessage("COMPUTER WINS!");
            setGameOver(true);
            return [card, ...prevDiscard];
          }

          if (isPenaltyCard(card)) {
            updateGameState({ penalty: stateRef.current.penalty + getPenaltyValue(card) });
          } else if (isQuestionCard(card)) {
            updateGameState({ pendingQ: true });
            setTimeout(computerTurn, 1000);
            return [card, ...prevDiscard];
          } else if (isJumpCard(card) || isKickbackCard(card)) {
            setTimeout(computerTurn, 1000);
            return [card, ...prevDiscard];
          }

          setIsPlayerTurn(true);
          return [card, ...prevDiscard];

        } else {
          // Draw
          const count = stateRef.current.penalty || 1;
          setGameMessage(`Computer draws ${count}`);
          updateGameState({ penalty: 0 });
          
          setDeck(currentDeck => {
             let activeDeck = checkReshuffle() || currentDeck;
             let drawn = [];
             for(let i=0; i<count; i++) {
               if(activeDeck.length > 0) drawn.push(activeDeck.shift());
             }
             newHand.push(...drawn); // Mutate hand copy
             return activeDeck;
          });
          
          setIsPlayerTurn(true);
          return prevDiscard;
        }
      });
      return newHand;
    });
  };

  return (
    <div className="board-container">
      <CurrentPlay gameMessage={gameMessage} topCard={discardPile[0]} />
      <HomeButton />
      <PlayerHand cards={playerHand} onCardClick={handleCardClick} />
      <ComputerHand cards={computerHand} reveal={gameOver} />
      <div className="controls-footer">
        <button 
          className={`action-btn ${nikoKadiDeclared ? 'btn-red' : 'btn-white'}`}
          onClick={handleNikoKadi}
          style={{marginRight:'20px'}}
        >
          NIKO KADI
        </button>
        <PlayButtons onDraw={handleDraw} />
      </div>
    </div>
  );
}

export default GameBoard;