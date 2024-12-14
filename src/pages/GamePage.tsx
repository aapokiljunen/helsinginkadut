import React, { useState, useEffect } from 'react';
import fetchRandomImages from '../services/finnApi';

function GamePage() {
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

	const [images, setImages] = useState<Image[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [guess, setGuess] = useState('');
	const [score, setScore] = useState({ correct: 0, incorrect: 0 });

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
			setGuess('');
			setCurrentIndex((prevIndex) => prevIndex + 1);
		}
	};

	if (images.length === 0) {
		return <div>Loading images...</div>;
	}

	if (currentIndex >= images.length) {
		return (
			<div>
				<h1>Game Over!</h1>
				<p>Correct answers: {score.correct}</p>
				<p>Incorrect answers: {score.incorrect}</p>
			</div>
		);
	}

	return (
		<div>
			<h1>Guess the Location</h1>
			<div>Kuva: {currentIndex+1} / 10. {images[currentIndex].street}</div>
			<img
				src={`https://finna.fi${images[currentIndex].imageUrl}`}
				alt="Guess the location"
				style={{ maxWidth: '100%'}}
			/>
			<div>
				<i>{images[currentIndex].owner}. {images[currentIndex].copyright}</i>
			</div>
			<input
				type="text"
				value={guess}
				onChange={(e) => setGuess(e.target.value)}
				placeholder="Enter your guess"
			/>
			<button onClick={handleGuessSubmit}>Submit Guess</button>
		</div>
	);
}


export default GamePage;


