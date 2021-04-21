import axios from 'axios';

export async function getChallenge(){
    const response = await axios.get('http://localhost:3000/api/challenge');
    return response.data;

    // return {items: []};
}