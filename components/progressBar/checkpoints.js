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
    if (total < config.kmToGermany) {
      return config.kmToGermany - total;
    }

    if (total < config.kmToNetherlands) {
      return config.kmToNetherlands - total;
    }

    if (total < config.kmToSpain) {
      return config.kmToSpain - total;
    }

    if (total < config.challengeTeamRecord) {
      return config.challengeTeamRecord - total;
    }

    return 0;
  };

  const getTextUntilNextChekcpoint = () => {
    if (total < config.kmToGermany) {
      return 'we reach Germany!';
    }

    if (total < config.kmToNetherlands) {
      return 'we reach Netherlands!';
    }

    if (total < config.kmToSpain) {
      return 'visit all dutch customers!';
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
          <img alt="start" src="/pc-lt.png" className={styles.checkpointIcon} />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(22% - 15px)' }}>
          <img
            alt="start"
            src="/germany.jpg"
            className={styles.checkpointIcon}
            style={{ opacity: getOpacity('kmToGermany') }}
          />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(30% - 15px)' }}>
          <img
            alt="start"
            className={styles.checkpointIcon}
            src="/pc-nl.png"
            style={{ opacity: getOpacity('kmToNetherlands') }}
          />
        </div>
        <div className={styles.checkpoint} style={{ left: 'calc(60% - 15px)' }}>
          <img
            alt="start"
            className={styles.checkpointIcon}
            src="/spain.png"
            style={{ opacity: getOpacity('kmToSpain') }}
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
