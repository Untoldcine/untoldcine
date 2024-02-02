import React from 'react';
import styles from './PlayNow.module.css';

const PlayNowButton = ({ onClick }) => {
  return (
    <button className={styles.playNowButton}>
      Play Now
    </button>
  );
};

export default PlayNowButton;
