// eslint-disable-next-line import/no-extraneous-dependencies
import { useMediaQuery } from 'react-responsive';
import styles from '../../styles/Home.module.css';
import { athleteMap } from '../../services/athlete';
import Table from './table';

function Leaderboard({
  athletes, goal, athlete, onlyTop1,
}) {
  let activities = athletes.filter((x) => athleteMap[x.name.toLowerCase()]);

  activities = activities.filter((x) => x.total > 0);

  const firstTableCount = Math.round(activities.length / 2);

  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' });

  return (
    <div className={styles.container}>
      <div className={styles.leaderboardContainer}>
        {isBigScreen && (
        <>
          <Table
            activities={activities.splice(0, firstTableCount)}
            goal={goal}
            athlete={athlete}
            onlyTop1={onlyTop1}
          />
          <Table
            activities={activities}
            goal={goal}
            athlete={athlete}
            startIndex={firstTableCount}
          />
        </>
        )}
        {!isBigScreen && (
        <Table
          activities={activities}
          goal={goal}
          athlete={athlete}
          onlyTop1={onlyTop1}
        />
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
