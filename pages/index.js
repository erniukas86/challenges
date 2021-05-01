import styles from '../styles/Home.module.css';
import { getChallenge } from '../services/challenge';
import { getAthleteName, getAthleteAvatar } from '../services/athlete';

function Home({ challenge }) {
  return (
    <div className={styles.container}>
      <h1>{challenge.name}</h1>
      <table className={styles.table}>
        <thead>
          <th>Rank</th>
          <th>Athlete</th>
          <th>Distance</th>
        </thead>
        {challenge.items.map((item, index) => (
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
