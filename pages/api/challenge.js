// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { tmpdir } = require('os');

import { config, stravaEndpoints } from './config';

export default async (req, res) => {
    try {
      const token = await getAccessToken();
      
      const activities = await getClubActivities(token);
      const savedActivities = await readSavedActivities();
      let result = await saveNewActivities(activities, savedActivities);
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

async function getClubActivities(token) {
  const response = await axios.get(stravaEndpoints.GET_CLUB_WORKOUTS,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
}

async function saveNewActivities(activities, savedActivities){
  const activitiesToSave = [];
  const startId = getStartId(savedActivities);

  for (let index = 0; index < activities.length; index++) {
    const activity = activities[index];

    if(getActivityId(activity) !== startId){
      activitiesToSave.push(activity);
    } else {
      if(savedActivities.length === 0){
      activitiesToSave.push(activity);
    }
      break;
    }
  }

  savedActivities.unshift(...activitiesToSave);

  const result = {
    items: savedActivities,
    name: config.challengeName,
    desciption: config.challengeDescription
  };

  await fs.writeFile(getPathToFile(), JSON.stringify(result));

  return result;
}

function getPathToFile (){
  return path.join(tmpdir(), `${config.challengeName}.json`);
}

async function readSavedActivities () {
  try {
    const fileContent = await fs.readFile(getPathToFile(), 'utf8');
    console.log('getPathToFile', getPathToFile());
    const result = JSON.parse(fileContent);

    if(result && result.items){
      return result.items;
    }

    return [];
  } catch (error) {
    return [];
  }
}

function getActivityId(activity){
  return `${activity.distance}${activity.moving_time}${activity.elapsed_time}${activity.total_elevation_gain}`;
}

function getStartId (savedActivities) {
  let startId = config.challengeStartId;

  if(savedActivities.length > 0){
    startId = getActivityId(savedActivities[0]);
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