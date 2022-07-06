import { config } from '../../pages/api/config';
import styles from '../../styles/Home.module.css';

export default function CheckpointsBar({ percent, unsetWidth, total }) {
  const clipPath = `inset(0 0 0 ${percent}%)`;

  const containerStyle = { height: '10px' };

  if (unsetWidth) {
    containerStyle.width = 'unset';
  }

  const getOpacity = (name) => {
    const kmGoal = config[name];
    if (total > kmGoal) {
      return '1';
    }
    return '0.1';
  };

  const getKmUntilNextChekcpoint = () => {
    if (total < config.kmToProAlpha) {
      return config.kmToProAlpha - total;
    }

    if (total < config.kmToDutchOffice) {
      return config.kmToDutchOffice - total;
    }

    if (total < config.kmForAllDutchCustomers) {
      return config.kmForAllDutchCustomers - total;
    }

    if (total < config.kmToKaunasOffice) {
      return config.kmToKaunasOffice - total;
    }

    if (total < config.challengeTeamRecord) {
      return config.challengeTeamRecord - total;
    }

    return 0;
  };

  const getTextUntilNextChekcpoint = () => {
    if (total < config.kmToProAlpha) {
      return 'visit to ProAlpha!';
    }

    if (total < config.kmToDutchOffice) {
      return 'visit Peter and Richard!';
    }

    if (total < config.kmForAllDutchCustomers) {
      return 'visit all dutch customers!';
    }

    if (total < config.kmToKaunasOffice) {
      return 'come back to Kaunas office';
    }

    if (total < config.challengeTeamRecord) {
      return 'beat PC record!';
    }

    return 0;
  };

  const getRecordBeatBy = () => total - config.challengeTeamRecord;

  const isRecordBeat = total > config.challengeTeamRecord;

  return (
    <>
      <h4>
        {`${total.toFixed(2)} KM already done.`}
        {!isRecordBeat && (
        <>
          {` ${getKmUntilNextChekcpoint().toFixed(2)} `}
          KM until
          {' '}
          {getTextUntilNextChekcpoint()}
        </>
        )}

        {isRecordBeat && ` WE BEAT RECORD BY: ${getRecordBeatBy().toFixed(2)} KM`}

      </h4>

      <div style={{ height: '50px', position: 'relative' }}>

        <div className={`${styles.teamRecordContainer} ${styles.checkpointContainer}`} style={containerStyle}>
          <div className={styles.teamRecordBackText} />
          <div
            className={styles.teamRecordFrontText}
            style={{ clipPath, WebkitClipPath: clipPath }}
          />
        </div>
        <div className={styles.checkpoint} style={{ backgroundColor: '#eed59a', left: 'calc(0% - 15px)' }}>
          <img alt="start" src="/start.png" className={styles.checkpointIcon} />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(35% - 15px)' }}>
          <img
            alt="start"
            src="/proAlpha.png"
            className={styles.checkpointIcon}
            style={{ opacity: getOpacity('kmToProAlpha') }}
          />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(45% - 15px)' }}>
          <img
            alt="start"
            className={styles.checkpointIcon}
            src="/pc-nl.png"
            style={{ opacity: getOpacity('kmToDutchOffice') }}
          />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(52% - 15px)' }}>
          <img
            alt="start"
            className={styles.checkpointIcon}
            src="/customers.png"
            style={{ opacity: getOpacity('kmForAllDutchCustomers') }}
          />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(87% - 15px)' }}>
          <img
            alt="start"
            className={styles.checkpointIcon}
            src="/pc-lt.png"
            style={{ opacity: getOpacity('kmToKaunasOffice') }}
          />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(100% - 15px)' }}>
          <img
            alt="start"
            className={styles.checkpointIcon}
            src="/finish.png"
            style={{ opacity: getOpacity('challengeTeamRecord') }}
          />
        </div>
      </div>
    </>
  );
}
