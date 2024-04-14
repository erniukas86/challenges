import Countdown, { zeroPad } from 'react-countdown';
import styles from '../styles/Home.module.css';
import { get } from './api/challenge';
import Leaderboard from '../components/leaderboard';
import athletes from '../data/athletes.json';

function Challengers({ challenge }) {
  const getCountDownDate = () => {
    const finishDate = new Date(2024, 6, 1);
    const today = new Date();
    const diff = finishDate.getTime() - today.getTime();
    return Date.now() + diff;
  };

  const renderer = ({
    days, hours, minutes, seconds, completed,
  }) => {
    if (completed) {
      return <span>Finished!</span>;
    }
    // Render a countdown
    return (
      <span className={styles.countDown}>
        {`${zeroPad(days)} days`}
        <br />
        {zeroPad(hours)}
        :
        {zeroPad(minutes)}
        :
        {zeroPad(seconds)}
      </span>
    );
  };

  const athletesActivities = challenge.items.filter((x) => !athletes[x.name].isTop3Ever);

  return (
    <div className={styles.container}>
      <h2>PC RUNNING CHALLENGERS 2024</h2>
      <Countdown renderer={renderer} date={getCountDownDate()}>
        <span>Finished!</span>
      </Countdown>
      <h4>
        Only TOP1 will be awarded with special prize.
        This list excludes people who ever reached TOP3 in the past/current
        challenges or won PC RUNNING CHALLENGERS cup.
      </h4>
      <Leaderboard athletes={athletesActivities} onlyTop1 />
    </div>
  );
}

export async function getStaticProps() {
  const challenge = await get();

  return {
    props: {
      challenge,
    },
    revalidate: 1,
  };
}

export default Challengers;
