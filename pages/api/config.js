export const config = {
  clientId: 55926,
  clientSecret: 'fc2ce3c73cd99258657f027a47164f061c5890fe',
  refreshToken: '0c3867795fc7196384bd4f85c472860fff40b985',
  stravaApiUrl: 'https://www.strava.com/api/v3',
  challengeName: 'PC CYCLING CHALLENGE 2022',
  challengeStartId: '8425.21878191621.8',
  challengeTeamRecord: 4655,
  challengeDescription: 'Rewards: >200Km: individual medals. Top 3: Special prizes and infinite glory.',
  kmToProAlpha: 1623,
  kmToDutchOffice: 2101,
  kmForAllDutchCustomers: 2415,
  kmToKaunasOffice: 4065,
};

export const stravaEndpoints = {
  GET_ACCESS_TOKEN: `${config.stravaApiUrl}/oauth/token`,
  GET_CLUB_WORKOUTS: `${config.stravaApiUrl}/clubs/775938/activities?per_page=200?page=0`,
};
