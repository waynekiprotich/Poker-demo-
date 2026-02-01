import { useNavigate } from 'react-router-dom';

function HomeButton() {
  const navigate = useNavigate();
  return (
    <div className="home-button-wrapper">
      <button className="action-btn home-btn" onClick={() => navigate('/')}>HOME</button>
    </div>
  );
}

export default HomeButton;