import axios from 'axios';

const API_URL = 'https://api.finna.fi/v1/search';


function extractStreet(input: string) {
	const match = RegExp(/^(\p{L}+)/u).exec(input);
	return match ? match[1] : '';
}

function extractAddress(input: string) {
	const match = RegExp(/^(\p{L}+)(?:\s(\d+))?/u).exec(input);
	if (match) {
		const word = match[1];
		const number = match[2] || '';
		return number ? `${word} ${number}` : word;
	}
	return '';
}

async function fetchRandomImages() {
	const images = [];

	for (let i = 0; i < 3; i++) {
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

			const address = extractAddress(records[0].title)
			const street = extractStreet(records[0].title)

			if (records.length > 0) {
				images.push({
					title: records[0].title,
					imageUrl: records[0].images?.[0] || '',
					id: records[0].id,
					copyright: records[0].imageRights.copyright,
					owner: records[0].buildings[0].translated,
					year: records[0].year || '',
					architect: records[0].nonPresenterAuthors[0].name || '',
					address: address,
					street: street,
				});
			}
		} catch (error) {
			console.error('Error fetching image:', error);
		}
	}

	return images;
}

export default fetchRandomImages;
