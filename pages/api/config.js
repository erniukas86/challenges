export const config = {
  clientId: 55926,
  clientSecret: 'fc2ce3c73cd99258657f027a47164f061c5890fe',
  refreshToken: '0c3867795fc7196384bd4f85c472860fff40b985',
  stravaApiUrl: 'https://www.strava.com/api/v3',
  challengeName: 'PC RUNNING CHALLENGE 2021',
  challengeStartId: '15213.25544558792.8',
  challengeTeamRecord: 3000,
  challengeDescription: 'Rewards: >75Km: individual medals. Top 3: Special prizes and infinite glory.',
};

export const stravaEndpoints = {
  GET_ACCESS_TOKEN: `${config.stravaApiUrl}/oauth/token`,
  GET_CLUB_WORKOUTS: `${config.stravaApiUrl}/clubs/772847/activities`,
};
