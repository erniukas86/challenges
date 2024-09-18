/* eslint-disable no-unreachable */
import { useMediaQuery } from 'react-responsive';
import styles from '../../styles/Home.module.css';
import { getAthleteName, getAthleteFirstName } from '../../services/athlete';
import ProgressBar from '../progressBar';

function Table({
  activities, goal, athlete, startIndex, onlyTop1,
}) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' });

  const calculateAthletePercent = (item) => {
    const result = (item.total / 10) / goal;
    return result.toFixed(2);
  };

  const calculateKmPerDay = (item) => {
    let result = parseInt(goal, 10) - item.total / 1000;

    const endDate = new Date(2024, 6, 1);
    const now = new Date();
    const diffTime = Math.abs(endDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    result /= diffDays;

    return result.toFixed(2);
  };

  const getIndex = (index) => {
    if (startIndex !== undefined) {
      return index + startIndex;
    }
    return index;
  };

  // const getAthleteRunningPB = (athleteChallenge) => {
  //   if (athleteChallenge.runningRecordKm && athleteChallenge.runningRecordYear) {
  //     return `PB: ${athleteChallenge.runningRecordKm} KM
  // (${athleteChallenge.runningRecordYear})`;
  //   }

  //   return null;
  // };

  // const isNewbieAtRunning = (athleteChallenge) => {
  //   if (!athleteChallenge.runningRecordKm || !athleteChallenge.runningRecordYear) {
  //     return (
  //       <span className={styles.badge}>NEW</span>
  //     );
  //   }

  //   return null;
  // };

  const getAthleteCyclingPB = (athleteChallenge) => {
    if (athleteChallenge.cyclingRecordKm && athleteChallenge.cyclingRecordYear) {
      return `PB: ${athleteChallenge.cyclingRecordKm} KM (${athleteChallenge.cyclingRecordYear})`;
    }

    return null;
  };

  // const isNewbieAtCycling = (athleteChallenge) => {
  //   if (!athleteChallenge.cyclingRecordKm || !athleteChallenge.cyclingRecordYear) {
  //     return (
  //       <span className={styles.badge}>NEW</span>
  //     );
  //   }

  //   return null;
  // };

  // const isRunningPB = (athleteChallenge) => {
  //   if (athleteChallenge.runningRecordKm
  //     && (athleteChallenge.total / 1000).toFixed(2) > athleteChallenge.runningRecordKm) {
  //     return (
  //       <span className={styles.badge}>PB!</span>
  //     );
  //   }

  //   return null;
  // };

  const isCyclingPB = (athleteChallenge) => {
    if (athleteChallenge.cyclingRecordKm
      && (athleteChallenge.total / 1000).toFixed(2) > athleteChallenge.cyclingRecordKm) {
      return (
        <span className={styles.badge}>PB!</span>
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <th>Rank</th>
          <th>Athlete</th>
          <th>Steps</th>
          {/* <th>Distance (KM)</th> */}
        </thead>
        {activities.map((item, index) => (
          <tr key={item.name}>
            <td>
              {getIndex(index) === 0 && '🥇'}
              {getIndex(index) === 1 && !onlyTop1 && '🥈'}
              {getIndex(index) === 2 && !onlyTop1 && '🥉'}
              {getIndex(index) < 3 && getIndex(index) > 0 && onlyTop1 && (
              <span className={styles.regularPlace}>
                {getIndex(index) + 1}
              </span>
              )}
              {getIndex(index) > 2 && (
              <span className={styles.regularPlace}>
                {getIndex(index) + 1}
              </span>
              )}
            </td>
            <td>
              <div className={styles.athlete}>
                {item.image && (
                <img
                  alt="runner"
                  className={styles.avatar}
                  // src={getAthleteAvatar(item.name)}
                  src={`https://media.walk15.lt/resources/${item.image}/100/100`}
                />
                )}
                {!item.image && (
                <span
                  alt="runner"
                  className={styles.avatar}
                  // src={getAthleteAvatar(item.name)}
                />
                )}

                <div>
                  {isTabletOrMobile ? getAthleteFirstName(item.name) : getAthleteName(item.name)}
                  {/* {isNewbieAtCycling(item)} */}
                  {isCyclingPB(item)}
                  <div className={styles.athletePBText}>{getAthleteCyclingPB(item)}</div>
                </div>
              </div>
              {item.name === athlete && goal && (
              <ProgressBar
                text={`${calculateAthletePercent(item)} %`}
                percent={calculateAthletePercent(item)}
                unsetWidth
              />
              )}
            </td>
            <td>
              {/* {(item.total / 1000).toFixed(2)} */}
              {item.total}
              {item.name === athlete && goal && (
              <div
                className={styles.kmPerdayText}
              >
                <span>
                  {' '}
                  {calculateKmPerDay(item)}
                </span>
                km each day to reach a goal!
              </div>
              ) }
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Table;
