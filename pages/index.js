import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Countdown, { zeroPad } from 'react-countdown';
import styles from '../styles/Home.module.css';
import { getAthleteName, athleteMap } from '../services/athlete';
import { get } from './api/challenge';
import CheckpointsBar from '../components/progressBar/checkpoints';
import Leaderboard from '../components/leaderboard';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    backgroundColor: '#363636',
    border: 'none',
    boxShadow: 'rgb(0 0 0 / 25%) 0px 54px 55px, rgb(0 0 0 / 12%) 0px -12px 30px, rgb(0 0 0 / 12%) 0px 4px 6px, rgb(0 0 0 / 17%) 0px 12px 13px, rgb(0 0 0 / 9%) 0px -3px 5px',
  },
  overlay: {
    backgroundColor: 'none',
  },
};

const storageKeys = {
  ATHLETE: 'ChallengeAthlete',
  GOAL: 'ChallengeGoal',
};

function Home({ challenge }) {
  const [isGoalDialogVisible, setIsGoalDialogVisible] = useState(false);
  const [athlete, setAthlete] = useState();
  const [goal, setGoal] = useState();

  useEffect(() => {
    setAthlete(localStorage.getItem(storageKeys.ATHLETE));
    setGoal(localStorage.getItem(storageKeys.GOAL));
  }, []);

  let teamTotalKm = 0;

  let activities = challenge.items.filter((x) => athleteMap[x.name.toLowerCase()]);

  activities.forEach((element) => {
    teamTotalKm += element.total;
  });

  activities = activities.filter((x) => x.total > 0);

  teamTotalKm /= 1000;

  const teamProgressText = `${teamTotalKm.toFixed(2)}/${challenge.teamRecord}km (PC record)`;
  const teamProgressInPercent = (teamTotalKm * 100) / challenge.teamRecord;

  const openGoalDialog = () => {
    setIsGoalDialogVisible(true);
  };

  const closeGoalDialog = () => {
    setIsGoalDialogVisible(false);
  };

  const saveGoal = () => {
    if (!athlete) {
      alert('Please select athlete 🏃');
      return;
    }

    if (!goal) {
      alert('Please select goal ⚽');
      return;
    }

    if (goal < 0) {
      alert('Goal should be bigger than 0 :)');
      return;
    }

    if (goal > 5000) {
      alert('You are too optimistic, please enter something real ;)');
      return;
    }

    if (Number.isNaN(goal)) {
      alert('Seems not a number :(');
      return;
    }

    localStorage.setItem(storageKeys.ATHLETE, athlete);
    localStorage.setItem(storageKeys.GOAL, goal);

    closeGoalDialog();
  };

  const getCountDownDate = () => {
    const finishDate = new Date(2024, 8, 1);
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

  return (
    <div className={styles.container}>
      <h2>
        {challenge.name}
        <button onClick={openGoalDialog} className={styles.goalButton} type="button">SET YOUR GOAL!</button>
        <span className={styles.challengeDescription}>{challenge.description}</span>
      </h2>
      <Countdown renderer={renderer} date={getCountDownDate()}>
        <span>Finished!</span>
      </Countdown>
      {/* <h4>{challenge.description}</h4> */}
      <CheckpointsBar text={teamProgressText} percent={teamProgressInPercent} total={teamTotalKm} />
      <Leaderboard athletes={challenge.items} goal={goal} athlete={athlete} />
      <ReactModal
        isOpen={isGoalDialogVisible}
        contentLabel="Minimal Modal Example"
        ariaHideApp={false}
        style={customStyles}
      >
        <div className={styles.dialogHeader}>
          Set your goal ⚽ for the entire challenge and track your progress.
          Important: your goal will not be visible for others :)
        </div>
        <div className={styles.dialogContent}>
          <select
            onChange={(e) => setAthlete(e.target.value)}
            className={styles.select}
          >
            <option value="">SELECT ATHLETE</option>
            {activities.map((item) => (
              <option
                value={item.name}
                selected={item.name === athlete}
              >
                {getAthleteName(item.name)}
              </option>
            ))}
          </select>
          <br />
          <input value={goal} onChange={(e) => setGoal(e.target.value)} type="number" className={styles.input} placeholder="Goal (km)" />
        </div>
        <div className={styles.dialogFooter}>
          <button type="button" className={styles.goalButton} onClick={closeGoalDialog}>Close</button>
          <button type="button" className={styles.goalButton} onClick={saveGoal}>Save</button>
        </div>
      </ReactModal>
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

export default Home;
