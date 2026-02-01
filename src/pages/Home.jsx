import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="board-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h1 style={{fontSize: '5vw', color: 'white', marginBottom: '20px'}}>KENYAN POKER</h1>
      <div style={{display: 'flex', gap: '20px'}}>
        <button className="action-btn btn-white" onClick={() => navigate('/play')}>START GAME</button>
        <button className="action-btn btn-red" onClick={() => navigate('/rules')}>HOW TO PLAY</button>
      </div>
    </div>
  );
}

export default Home;