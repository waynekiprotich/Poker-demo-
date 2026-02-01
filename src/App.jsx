import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameBoard from './pages/GameBoard';
import Rules from './pages/Rules';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<GameBoard />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </BrowserRouter>
  );
}