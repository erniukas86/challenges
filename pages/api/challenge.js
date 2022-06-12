/* eslint-disable no-param-reassign */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { config, stravaEndpoints } from './config';

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { tmpdir } = require('os');

async function getAccessToken() {
  const response = await axios.post(stravaEndpoints.GET_ACCESS_TOKEN, {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken,
  });

  return response.data.access_token;
}

async function getClubActivities(token) {
  const response = await axios.get(stravaEndpoints.GET_CLUB_WORKOUTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('getClubActivities', response.data);

  return response.data;
}

function getActivityId(activity) {
  return `${activity.distance}${activity.moving_time}${activity.elapsed_time}${activity.total_elevation_gain}`;
}

function getStartId(savedActivities) {
  let startId = config.challengeStartId;

  if (savedActivities.length > 0) {
    startId = getActivityId(savedActivities[0]);
  }

  return startId;
}

function getPathToFile() {
  return path.join(tmpdir(), `${config.challengeName}.json`);
}

async function saveNewActivities(activities, savedActivities) {
  const activitiesToSave = [];
  const startId = getStartId(savedActivities);

  for (let index = 0; index < activities.length; index++) {
    const activity = activities[index];

    if (getActivityId(activity) !== startId) {
      activitiesToSave.push(activity);
    } else {
      if (savedActivities.length === 0) {
        activitiesToSave.push(activity);
      }
      break;
    }
  }

  savedActivities.unshift(...activitiesToSave);

  const result = {
    items: savedActivities,
    name: config.challengeName,
    description: config.challengeDescription,
    teamRecord: config.challengeTeamRecord,
  };

  await fs.writeFile(getPathToFile(), JSON.stringify(result));

  return result;
}

async function readSavedActivities() {
  try {
    const fileContent = await fs.readFile(getPathToFile(), 'utf8');
    const result = JSON.parse(fileContent);

    if (result && result.items) {
      return result.items;
    }

    return [];
  } catch (error) {
    return [];
  }
}

function calculateTotals(challenge) {
  const result = { ...challenge };
  result.items = [];

  for (let index = 0; index < challenge.items.length; index++) {
    const workout = challenge.items[index];

    let athleteName = `${workout.athlete.firstname}${workout.athlete.lastname}`;

    if (athleteName.toLocaleLowerCase() === 'rokass.' && workout.name.toLocaleLowerCase().indexOf('pc running') > -1) {
      athleteName = 'rokassi.';
    }

    const item = result.items.find((x) => x.name === athleteName);

    if (item) {
      item.total += workout.distance;
    } else {
      result.items.push({
        name: athleteName,
        total: workout.distance,
      });
    }
  }

  result.items.sort((a, b) => (a.total < b.total ? 1 : -1));

  return result;
}

function applyModifier(result) {
  const modifiers = {
    'dariuso.': 96200,
    'henrikasm.': 0,
    'simasv.': 22300,
    'petern.': 14600,
    'erniukasb.': 254800,
    'edgarasa.': 109300,
    'rokass.': 4000,
    'pauliusv.': 173300,
    'martynasj.': 77100,
    'audriusl.': 16400,
    'klaidasp.': 129900,
    'sandraž.': 7700,
    'andrejusi.': 228400,
    'edvinasv.': 0,
    'raimondap.': 33900,
    'mildag.': 0,
    'danilk.': 0,
    'mantasr.': 28400,
    'oļegsč.': 0,
    'tadask.': 8000,
    'robertask.': 0,
    'vaidas.': 102300,
    'rokassi.': 25500,
    'egidijusr.': 24900,
    'juozasn.': 16300,
    'maj0rboobzp.': 0,
    'tomasb.': 0,
    'mindaugass.': 0,
    'justinasl.': 0,
  };

  const keys = Object.keys(modifiers);

  const items = [];

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const res = result.items.find((x) => x.name.toLowerCase() === key);
    let total = modifiers[key];

    if (res) {
      total += res.total;
    }

    items.push({ name: key, total });
  }

  result.items = items;

  result.items.sort((a, b) => (a.total < b.total ? 1 : -1));

  return result;
}

export async function get() {
  const token = await getAccessToken();

  const activities = await getClubActivities(token);
  const savedActivities = await readSavedActivities();
  let result = await saveNewActivities(activities, savedActivities);
  result = calculateTotals(result);
  return applyModifier(result);
}

export default async (req, res) => {
  try {
    const token = await getAccessToken();

    const activities = await getClubActivities(token);
    const savedActivities = await readSavedActivities();
    let result = await saveNewActivities(activities, savedActivities);
    result = calculateTotals(result);

    res.status(200).json(applyModifier(result));
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
