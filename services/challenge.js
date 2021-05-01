import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export async function getChallenge() {
  const response = await axios.get(`${process.env.API_URL}/challenge`);
  return response.data;
}
