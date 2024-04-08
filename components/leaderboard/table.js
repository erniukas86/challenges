import styles from '../../styles/Home.module.css';
import { getAthleteName, getAthleteAvatar } from '../../services/athlete';
import ProgressBar from '../progressBar';

function Table({
  activities, goal, athlete, startIndex,
}) {
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

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <th>Rank</th>
          <th>Athlete</th>
          <th>Distance</th>
        </thead>
        {activities.map((item, index) => (
          <tr key={item.name}>
            <td>
              {getIndex(index) === 0 && '🥇'}
              {getIndex(index) === 1 && '🥈'}
              {getIndex(index) === 2 && '🥉'}
              {getIndex(index) > 2 && (
              <span className={styles.regularPlace}>
                {getIndex(index) + 1}
              </span>
              )}
            </td>
            <td>
              <div className={styles.athlete}>
                <img
                  alt="runner"
                  className={styles.avatar}
                  src={getAthleteAvatar(item.name)}
                />
                {getAthleteName(item.name)}
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
              {(item.total / 1000).toFixed(2)}
              {' '}
              km
              {item.name === athlete && goal && (
              <div
                className={styles.kmPerdayText}
              >
                Run
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
