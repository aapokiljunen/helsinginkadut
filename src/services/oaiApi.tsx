import axios from 'axios';

async function getNeighborhood(address: string) {
	const response = await axios.get('https://nominatim.openstreetmap.org/search', {
		params: {
			q: address,
			format: 'json',
			addressdetails: 1,
		},
	});

	if (response.data.length > 0) {
		const result = response.data[0];
		const neighborhood = result.address.neighbourhood;
		return neighborhood;
	} else {
		return '';
	}
}


export default getNeighborhood;