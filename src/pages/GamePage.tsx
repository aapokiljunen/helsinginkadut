import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Card, CardMedia, CardContent } from '@mui/material';
import fetchRandomImages from '../services/finnApi';
import { auth } from '../services/firebase';
import { getUsernameFromFirestore } from '../services/FirestoreService';

interface Image {
    title: string;
    imageUrl: string;
    id: string;
    copyright: string;
    owner: string;
    year: number;
    architect: string;
    streets: string[];
}

const GamePage: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [guess, setGuess] = useState('');
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [guesses, setGuesses] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadImages() {
            const fetchedImages = await fetchRandomImages();
            setImages(fetchedImages);
        }
        loadImages();
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleGuessSubmit();
        }
    };

    const handleGuessSubmit = () => {
        if (images[currentIndex]) {
            const isCorrect = images[currentIndex].streets.some(
                (street) => street.toLowerCase() === guess.toLowerCase()
            );
            setScore((prevScore) => ({
                correct: prevScore.correct + (isCorrect ? 1 : 0),
                incorrect: prevScore.incorrect + (isCorrect ? 0 : 1),
            }));

            setGuesses((prevGuesses) => [...prevGuesses, guess]);
            setGuess('');
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    useEffect(() => {
        if (currentIndex >= images.length && images.length > 0) {
            navigate('/results', { state: { score, images, guesses } });
        }
    }, [currentIndex, images.length, navigate, score, guesses]);

    if (images.length === 0) {
        return <Box sx={{ marginTop: '40px' }}><Typography variant="body1">Ladataan kuvia...</Typography></Box>;
    }

    if (currentIndex >= images.length) {
        return null;
    }

    return (
        <Box sx={{ marginTop: '40px' }}>
            <Typography variant="subtitle1">
                Kuva: {currentIndex + 1} / {images.length}
            </Typography>
            <Card>
                <CardMedia
                    component="img"
                    image={`https://finna.fi${images[currentIndex].imageUrl}`}
                    alt="Tunnista sijainti"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '60vh',
                        objectFit: 'contain',
                    }}
                />
                <CardContent>
                    <Typography variant="body2">
                        <b>
                            {images[currentIndex].architect}. {images[currentIndex].year}
                        </b>
                    </Typography>
                    <Typography variant="body2">
                        <i>
                            {images[currentIndex].owner}. {images[currentIndex].copyright}
                        </i>
                    </Typography>
                </CardContent>
            </Card>
            <Box mt={2}>
                <TextField
                    fullWidth
                    label="Vastaa kadunnimi"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGuessSubmit}
                >
                    Lähetä vastaus
                </Button>
            </Box>
        </Box>
    );
};

export default GamePage;
