// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { tmpdir } = require('os');

import { config, stravaEndpoints } from './config';
import data from './data/runningChallenge2021.json';

export default async (req, res) => {
    try {
      const token = await getAccessToken();
      
      const workouts = await getClubWorkouts(token);
      let result = await saveNewWorkouts(workouts);
      result = calculateTotals(result);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
}

async function getAccessToken(){
  const response = await axios.post(stravaEndpoints.GET_ACCESS_TOKEN, {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken
  });

  return response.data.access_token;
}

async function getClubWorkouts(token) {
  const response = await axios.get(stravaEndpoints.GET_CLUB_WORKOUTS,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
}

async function saveNewWorkouts(activities){
  const activitiesToSave = [];
  const startId = getStartId();

  for (let index = 0; index < activities.length; index++) {
    const activity = activities[index];

    if(getActivityId(activity) !== startId){
      activitiesToSave.push(activity);
    } else {
      if(data.items && data.items.length === 0){
      activitiesToSave.push(activity);
    }
      break;
    }
  }

  data.items.unshift(...activitiesToSave);

  const pathToFile = path.join(tmpdir(), 'runningChallenge2021.json');

  await fs.writeFile(pathToFile, JSON.stringify(data));

  return data;
}

function getActivityId(activity){
  return `${activity.distance}${activity.moving_time}${activity.elapsed_time}${activity.total_elevation_gain}`;
}

function getStartId () {
  let startId = data.startId;

  if(data.items && data.items.length > 0){
    startId = getActivityId(data.items[0]);
  }

  return startId;
}

function calculateTotals (challenge) {
  let result = {...challenge};
  result.items = [];

  for (let index = 0; index < challenge.items.length; index++) {
    const workout = challenge.items[index];
    
    const athleteName = `${workout.athlete.firstname}${workout.athlete.lastname}`;

    const item = result.items.find(x=> x.name === athleteName);

    if(item){
      item.total += workout.distance;
    } else {
      result.items.push({
        name: athleteName,
        total: workout.distance
      });
    }
  }

  result.items.sort((a, b) => a.total < b.total ? 1 : -1 );

  return result;
}