import styles from '../styles/Home.module.css';
import { getChallenge } from '../services/challenge';
import { getAthleteName, getAthleteAvatar, athleteMap } from '../services/athlete';

function Home({ challenge }) {
  let teamTotalKm = 0;

  const activities = challenge.items.filter((x) => athleteMap[x.name.toLowerCase()]);

  activities.forEach((element) => {
    teamTotalKm += element.total;
  });

  teamTotalKm /= 1000;

  const progressText = `${teamTotalKm.toFixed(2)}/${challenge.teamRecord}km (PC record)`;
  const progressInPercent = (teamTotalKm * 100) / challenge.teamRecord;
  const clipPath = `inset(0 0 0 ${progressInPercent}%)`;

  return (
    <div className={styles.container}>
      <h2>{challenge.name}</h2>
      <h4>{challenge.description}</h4>
      <div className={styles.teamRecordContainer}>
        <div className={styles.teamRecordBackText}>{progressText}</div>
        <div
          className={styles.teamRecordFrontText}
          style={{ clipPath, WebkitClipPath: clipPath }}
        >
          {progressText}
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <th>Rank</th>
          <th>Athlete</th>
          <th>Distance</th>
        </thead>
        {activities.map((item, index) => (
          <tr key={item.name}>
            <td>
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && <span className={styles.regularPlace}>{index + 1}</span>}
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

            </td>
            <td>
              {(item.total / 1000).toFixed(2)}
              {' '}
              km
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export async function getStaticProps() {
  const challenge = await getChallenge();

  return {
    props: {
      challenge,
    },
    revalidate: 1,
  };
}

export default Home;
