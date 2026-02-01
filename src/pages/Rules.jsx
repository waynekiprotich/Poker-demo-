import { useNavigate } from 'react-router-dom';

function Rules() {
  const navigate = useNavigate();
  return (
    <div className="board-container" style={{display: 'block', color: 'white', overflowY: 'auto'}}>
      <h1>OFFICIAL KADI RULES</h1>
      <ul style={{fontSize: '1.2rem', lineHeight: '1.6'}}>
        <li><strong>Goal:</strong> Finish all cards. Declare "Niko Kadi" with 1 card left.</li>
        <li><strong>Play:</strong> Match Suit or Rank of the discard pile.</li>
        <li><strong>Question (Q/8):</strong> Must be followed by a matching Answer card.</li>
        <li><strong>Penalty (2/3/Joker):</strong> Opponent draws cards. Penalties stack!</li>
        <li><strong>Winning:</strong> You must end on an Answer card or Question+Answer combo.</li>
      </ul>
      <button className="action-btn btn-white" onClick={() => navigate('/')}>BACK HOME</button>
    </div>
  );
}

export default Rules;