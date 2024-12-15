import React from 'react';
import { useLocation } from 'react-router-dom';

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

const ResultsPage: React.FC = () => {
  const { state } = useLocation();
  const { score, images, guesses } = state || { score: { correct: 0, incorrect: 0 }, images: [], guesses: [] };

  const showAnswers = () => (
    <ul>
      {images.map((image: Image, index: number) => {
        const userGuess = guesses[index] || '';
        const isCorrect = userGuess.toLowerCase() === image.street.toLowerCase();

        return (
          <li key={index} style={{ marginBottom: '20px' }}>
            <img src={`https://finna.fi${image.imageUrl}`} alt={image.title} style={{ maxWidth: '100px' }} />
            <p>{image.street}</p>
            <p>
              <strong>Oikea vastaus:</strong> {image.street} <br />
              <strong>Sinun vastauksesi:</strong> {userGuess || 'Ei vastausta'} <br />
              {isCorrect ? (
                <span style={{ color: 'green' }}>Oikein!</span>
              ) : (
                <span style={{ color: 'red' }}>Väärin</span>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <h1>Peli on ohi!</h1>
      <p>Oikeat vastaukset: {score.correct}</p>
      <p>Väärät vastaukset: {score.incorrect}</p>

      <h2>Kuvien vastaukset:</h2>
      {showAnswers()}

      <button onClick={() => window.location.reload()}>Aloita uusi peli</button>
    </div>
  );
};

export default ResultsPage;
