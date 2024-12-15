import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Divider, Tooltip } from '@mui/material';

interface Image {
	title: string;
	imageUrl: string;
	id: string;
	copyright: string;
	owner: string;
	year: number;
	architect: string;
	address: string;
	streets: string[];
}



const ResultsPage: React.FC = () => {
	const { state } = useLocation();
	const { score, images, guesses } = state || { score: { correct: 0, incorrect: 0 }, images: [], guesses: [] };

	const navigate = useNavigate();

	const handleNewGame = () => {
		navigate('/');
	};

	return (
		<Box sx={{ marginTop: '40px' }}>
			<Typography variant="subtitle1">
				<b>Kierros ohi.</b>
			</Typography>
			<Typography variant="subtitle1">
				Tulos: {score.correct} / {images.length}.
			</Typography>
			<List>
				{images.map((image: Image, index: number) => {
					const userGuess = guesses[index] || '';
					const isCorrect = image.streets.some(
						(street) => street.toLowerCase() === userGuess.toLowerCase()
					);

					return (
						<React.Fragment key={index}>
							<ListItem style={{ flexDirection: 'column' }}>
								<ListItemText
									primary={`${image.title}`}
									secondary={`${image.architect}. ${image.year}`}
								/>
								<ListItemAvatar>
									<Tooltip title={`${image.owner}. ${image.copyright}`} arrow>
										<Avatar
											variant="square"
											src={`https://finna.fi${image.imageUrl}`}
											alt={image.title}
											style={{ width: 150, height: 150 }}
										/>
									</Tooltip>
								</ListItemAvatar>
								<ListItemText
									primary={`${image.streets.length > 1 ? "Oikeat vastaukset" : "Oikea vastaus"}: ${image.streets.join(", ")}`}
									secondary={
										<>
											<Typography variant="body2">
												<strong>Sinun vastauksesi:</strong> {userGuess || 'Ei vastausta'}
											</Typography>
											<Typography
												variant="body2"
												style={{ color: isCorrect ? 'green' : 'red' }}
											>
												{isCorrect ? 'Oikein!' : 'Väärin'}
											</Typography>
										</>
									}
								/>
							</ListItem>
							<Divider variant="inset" component="li" />
						</React.Fragment>
					);
				})}
			</List>
			<Button
				variant="contained"
				color="primary"
				onClick={handleNewGame}
				style={{ marginTop: '20px' }}
			>
				Aloita uusi peli
			</Button>
		</Box>
	);
};

export default ResultsPage;
