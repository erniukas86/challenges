const fs = require('fs').promises;
const path = require('path');
const { tmpdir } = require('os');

import { config, stravaEndpoints } from './config';

export default async (req, res) => {
    try {
        const result = {
            items: [],
            name: config.challengeName,
            desciption: config.challengeDescription
          };
        
          await fs.writeFile(getPathToFile(), JSON.stringify(result));

      res.status(200).json({success: true});
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
}

function getPathToFile (){
    return path.join(tmpdir(), `${config.challengeName}.json`);
  }