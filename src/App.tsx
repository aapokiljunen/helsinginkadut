import { Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from './styles/GamePageStyles';
import Header from './commons/Header';
import LoginForm from './commons/LoginForm';
import HighScoresPage from './pages/HighScoresPage';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Routes>
                <Route path="/" element={<GamePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/highscores" element={<HighScoresPage />} />
                <Route path="/login" element={<LoginForm />} />
            </Routes >
        </ThemeProvider>
    );
};

export default App;