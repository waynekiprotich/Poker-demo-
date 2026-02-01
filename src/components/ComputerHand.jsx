function ComputerHand({ cards = [], reveal = false }) {
  const displayCards = reveal ? cards : Array(cards.length).fill(0);
  return (
    <div className="computer-container">
      <div className="hand-label">COMPUTER</div>
      <div className="cards-row">
        {displayCards.map((card, index) => (
          <img 
            key={index} 
            className="card-img" 
            src={reveal ? card.image : "https://deckofcardsapi.com/static/img/back.png"} 
            alt="Computer Card" 
          />
        ))}
      </div>
    </div>
  );
}

export default ComputerHand;