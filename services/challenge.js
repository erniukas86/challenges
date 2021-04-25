import axios from 'axios';

export async function getChallenge(){
    console.log(process.env.API_URL);
    const response = await axios.get(`${process.env.API_URL}/challenge`);
    return response.data;
}