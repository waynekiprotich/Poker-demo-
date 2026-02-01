function PlayButtons({ onDraw }) {
  return (
    <div className="playButton-container">
      <button className="action-btn btn-red">PLAY CARD</button>
      <button className="action-btn btn-white" onClick={onDraw}>DRAW CARD</button>
    </div>
  );
}

export default PlayButtons;