import React, { useEffect, useState } from 'react';
import { getHighScores, getUserResults, Result } from '../services/FirestoreService';
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HighScoresPage: React.FC = () => {
	const [highScores, setHighScores] = useState<Result[]>([]);
	const [userResults, setUserResults] = useState<Result[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchResults = async () => {
			setLoading(true);
			try {
				const fetchedHighScores = await getHighScores();
				setHighScores(fetchedHighScores);

				const fetchedUserResults = await getUserResults();
				setUserResults(fetchedUserResults);
			} catch (error) {
				console.error('Virhe tuloksia haettaessa:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, []);

	const handleNewGame = () => {
		navigate('/');
	};

	return (
		<Box sx={{ marginTop: '40px' }}>
			<Typography variant="h5" gutterBottom>
				Kaikkien aikojen parhaat
			</Typography>

			<Box>
				{loading ? (
					<Typography variant="body1">Ladataan...</Typography>
				) : (
					<List>
						{highScores.map((result, index) => (
							<React.Fragment key={index}>
								<ListItem sx={{ flexDirection: 'column', textAlign: 'left' }}>
									<ListItemText
										primary={`Pisteet: ${result.score}`}
										secondary={`Nimi: ${result.username} - Päivämäärä: ${new Date(result.timestamp).toLocaleString()}`}
										sx={{ display: 'block', width: '100%' }}
									/>
								</ListItem>
								<Divider variant="inset" component="li" />
							</React.Fragment>
						))}
					</List>
				)}
			</Box>

			<Box sx={{ marginTop: '40px' }}>
				<Typography variant="h5" gutterBottom>
					Omat tulokset
				</Typography>
				{loading ? (
					<Typography variant="body1">Ladataan...</Typography>
				) : userResults.length > 0 ? (
					<List>
						{userResults.map((result, index) => (
							<React.Fragment key={index}>
								<ListItem sx={{ flexDirection: 'column', textAlign: 'left' }}>
									<ListItemText
										primary={`Pisteet: ${result.score}`}
										secondary={`Nimi: ${result.username} - Päivämäärä: ${new Date(result.timestamp).toLocaleString()}`}
										sx={{ display: 'block', width: '100%' }}
									/>
								</ListItem>
								<Divider variant="inset" component="li" />
							</React.Fragment>
						))}
					</List>
				) : (
					<Typography variant="body1">Ei tuloksia löytynyt.</Typography>
				)}
			</Box>


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

export default HighScoresPage;
