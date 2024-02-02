import React from 'react';
import styles from './PlayNow.module.css';

const PlayNowButton = ({ title }) => {
  return (
    <button className={styles.playNowButton}>
      {title}
    </button>
  );
};

export default PlayNowButton;
