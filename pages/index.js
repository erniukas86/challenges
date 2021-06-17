import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Countdown from 'react-countdown';
import styles from '../styles/Home.module.css';
import { getChallenge } from '../services/challenge';
import { getAthleteName, getAthleteAvatar, athleteMap } from '../services/athlete';
import ProgressBar from '../components/progressBar';

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

  const activities = challenge.items.filter((x) => athleteMap[x.name.toLowerCase()]);

  activities.forEach((element) => {
    teamTotalKm += element.total;
  });

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

  const calculateAthletePercent = (item) => {
    const result = (item.total / 10) / goal;
    return result.toFixed(2);
  };

  const calculateKmPerDay = (item) => {
    let result = parseInt(goal, 10) - item.total / 1000;

    const endDate = new Date(2021, 7, 1);
    const now = new Date();
    const diffTime = Math.abs(endDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    result /= diffDays;

    return result.toFixed(2);
  };

  const getCountDownDate = () => {
    const finishDate = new Date(2021, 7, 1);
    const today = new Date();
    const diff = finishDate.getTime() - today.getTime();
    return Date.now() + diff;
  };

  return (
    <div className={styles.container}>
      <h2>
        {challenge.name}
        <button onClick={openGoalDialog} className={styles.goalButton} type="button">SET YOUR GOAL!</button>
      </h2>
      {/* <span className={styles.countDown}>55 days 2:45:22</span> */}
      <Countdown className={styles.countDown} date={getCountDownDate()}>
        <span>Finished!</span>
      </Countdown>
      <h4>{challenge.description}</h4>
      <ProgressBar text={teamProgressText} percent={teamProgressInPercent} />
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
  const challenge = await getChallenge();

  return {
    props: {
      challenge,
    },
    revalidate: 1,
  };
}

export default Home;
