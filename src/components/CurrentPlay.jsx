function CurrentPlay({ gameMessage, topCard }) {
  const cardImage = topCard?.image || "https://deckofcardsapi.com/static/img/back.png";
  return (
    <div className="currentPlay-container">
      <div className="game-move-box">
        <span style={{padding: '10px', textAlign: 'center'}}>{gameMessage}</span>
      </div>
      <img className="deck-card" src={cardImage} alt="Active Card" />
    </div>
  );
}

export default CurrentPlay;