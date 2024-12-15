import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchRandomImages from '../services/finnApi';

interface Image {
	title: string;
	imageUrl: string;
	id: string;
	copyright: string;
	owner: string;
	year: number;
	architect: string;
	address: string;
	street: string;
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

	const handleGuessSubmit = () => {
		if (images[currentIndex]) {
		  const isCorrect = guess.toLowerCase() === images[currentIndex].street.toLowerCase();
		  setScore((prevScore) => ({
			correct: prevScore.correct + (isCorrect ? 1 : 0),
			incorrect: prevScore.incorrect + (isCorrect ? 0 : 1),
		  }));
	  
		  setGuesses([...guesses, guess]);
		  setGuess('');
		  setCurrentIndex((prevIndex) => prevIndex + 1);
		}
	  };
	  

	useEffect(() => {
		// Navigointi tulossivulle vain, kun kaikki kuvat on käsitelty
		if (currentIndex >= images.length && images.length > 0) {
			console.log(guesses)
			navigate('/results', { state: { score, images, guesses } });
		}
	}, [currentIndex, images.length, navigate, score, guesses]);

	// Lisää tarkistus, ettei currentIndex mene yli images.length
	if (images.length === 0) {
		return <div>Ladataan kuvia...</div>;
	}

	if (currentIndex >= images.length) {
		return null;  // Ei tarvita tätä, koska navigointi hoitaa tämän
	}

	return (
		<div>
			<h1>Arvaa sijainti</h1>
			<div>Kuva: {currentIndex + 1} / {images.length}</div>
			<img
				src={`https://finna.fi${images[currentIndex].imageUrl}`}
				alt="Arvaa sijainti"
				style={{ maxWidth: '100%' }}
			/>
			<div>
				<i>{images[currentIndex].owner}. {images[currentIndex].copyright}</i>
			</div>
			<input
				type="text"
				value={guess}
				onChange={(e) => setGuess(e.target.value)}
				placeholder="Syötä arvauksesi"
			/>
			<button onClick={handleGuessSubmit}>Lähetä vastaus</button>
		</div>
	);
};

export default GamePage;
