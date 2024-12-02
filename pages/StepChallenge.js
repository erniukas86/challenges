/* eslint-disable no-unreachable */
import Countdown, { zeroPad } from "react-countdown";
import styles from "../styles/Home.module.css";
import { getSteps } from "./api/challenge";
import Leaderboard from "../components/leaderboard";

function Challengers({ challenge }) {
  const getCountDownDate = () => {
    const finishDate = new Date(2024, 11, 3);
    const today = new Date();
    const diff = finishDate.getTime() - today.getTime();
    return Date.now() + diff;
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Finished!</span>;
    }
    // Render a countdown
    return (
      <span className={styles.countDown}>
        {`${zeroPad(days)} days`}
        <br />
        {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );
  };
  const activities = challenge.map((item) => ({
    name: item.firstname,
    total: item.steps,
    image: item.image,
  }));

  return (
    <div className={styles.container}>
      <h2>PC Walking challenge 2024</h2>
      <Countdown renderer={renderer} date={getCountDownDate()}>
        <span>Finished!</span>
      </Countdown>
      <h4>
        Yearly PC 3-Month Steps Challenge – It is time to track our steps,
        challenge ourselves, and celebrate our progress! 🤩
      </h4>
      <Leaderboard athletes={activities} skipAthletesMapping />
    </div>
  );
}

export async function getStaticProps() {
  const challenge = await getSteps();

  return {
    props: {
      challenge,
    },
    revalidate: 1,
  };
}

export default Challengers;
