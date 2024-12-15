import { Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
};

export default App;