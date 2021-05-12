import styles from '../../styles/Home.module.css';

export default function ProgressBar({ text, percent, unsetWidth }) {
  const clipPath = `inset(0 0 0 ${percent}%)`;

  const containerStyle = {};

  if (unsetWidth) {
    containerStyle.width = 'unset';
  }

  return (
    <div className={styles.teamRecordContainer} style={containerStyle}>
      <div className={styles.teamRecordBackText}>{text}</div>
      <div
        className={styles.teamRecordFrontText}
        style={{ clipPath, WebkitClipPath: clipPath }}
      >
        {text}
      </div>
    </div>
  );
}
