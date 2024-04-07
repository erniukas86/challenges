// eslint-disable-next-line import/no-extraneous-dependencies
import { useMediaQuery } from 'react-responsive';
import styles from '../../styles/Home.module.css';
import { athleteMap } from '../../services/athlete';
import Table from './table';

function Leaderboard({ challenge, goal, athlete }) {
  let activities = challenge.items.filter((x) => athleteMap[x.name.toLowerCase()]);

  activities = activities.filter((x) => x.total > 0);

  const firstTableCount = Math.round(activities.length / 2);

  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' });
  console.log('isBigScreen', isBigScreen);

  return (
    <div className={styles.container}>
      <div className={styles.leaderboardContainer}>
        {isBigScreen && (
        <>
          <Table activities={activities.splice(0, firstTableCount)} goal={goal} athlete={athlete} />
          <Table
            activities={activities}
            goal={goal}
            athlete={athlete}
            startIndex={firstTableCount}
          />
        </>
        )}
        {!isBigScreen && <Table activities={activities} goal={goal} athlete={athlete} />}
      </div>
    </div>
  );
}

export default Leaderboard;
