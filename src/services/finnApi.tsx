import axios from 'axios';

const API_URL = 'https://api.finna.fi/v1/search';


function extractStreets(data: string): string[] {
	// Pilkotaan data-merkistö osiin, joissa on kadunnimet
	const streetNames: string[] = [];

	// Erota osa ennen puolipistettä (poistetaan puolipisteen jälkeinen sisältö)
	const partBeforeSemicolon = data.split(';')[0];

	// Pilkotaan merkkijono osiin esimerkiksi pilkkujen, pisteiden tai puolipisteiden mukaan
	const entries = partBeforeSemicolon.split(/[.,;]/);  // Pilkotaan pilkusta, pisteestä tai puolipisteestä

	entries.forEach(entry => {
		const street = entry
		.trim()
		.replace(/\s?\d+[a-zA-Z]*[-a-zA-Z]*/g, "")  // Poistaa numerot ja mahdolliset kirjaimet/yhdysmerkit numeron jälkeen (esim. 3-5, 15a)
		.replace(/\d+/g, "")  // Poistaa kaikki numerot
		.replace(/[\s\-]+$/g, "") // Poistaa mahdolliset ylimääräiset välilyönnit ja yhdysmerkit lopusta
		.trim();  // Poistaa mahdolliset ylimääräiset välilyönnit

		// Poistetaan myös 'Helsinki' jos se löytyy
		const cleanedStreet = street.replace(/Helsinki/i, "").trim();

		if (cleanedStreet) {
			streetNames.push(cleanedStreet);  // Lisää katu listaan, jos se ei ole tyhjä
		}
	});

	return streetNames;
}

async function fetchRandomImages() {
	const images = [];

	for (let i = 0; i < 10; i++) {
		const randomPage = Math.floor(Math.random() * 2500);
		const params = {
			limit: 1,
			page: randomPage,
			filter: [
				'free_online_boolean:1',
				'~format_ext_str_mv:0/Place/',
			],
			lookfor: 'Helsinki',
			type: 'AllFields',
		};


		try {
			const response = await axios.get(API_URL, { params });
			const records = response.data.records;

			const streets = extractStreets(records[0].title);

			if (records.length > 0 && records[0].title && records[0].images) {
				images.push({
					title: records[0].title,
					imageUrl: records[0].images?.[0] || '',
					id: records[0].id,
					copyright: records[0].imageRights?.copyright || '',
					owner: records[0].buildings?.[0]?.translated || '',
					year: records[0].year || '',
					architect: records[0].nonPresenterAuthors?.[0]?.name || '',
					streets: streets,
				});
			}
		} catch (error) {
			console.error('Error fetching image:', error);
		}
	}

	return images;
}

export default fetchRandomImages;
