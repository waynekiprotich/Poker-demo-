function PlayerHand({ cards, onCardClick }) {
  return (
    <div className="player-container">
      <div className="hand-label">PLAYER</div>
      <div className="cards-row">
        {cards.map((card, index) => (
          <img 
            key={index} 
            className="card-img" 
            src={card.image} 
            alt="My Card" 
            onClick={() => onCardClick(index)}
            style={{cursor: 'pointer'}}
          />
        ))}
      </div>
    </div>
  );
}

export default PlayerHand;