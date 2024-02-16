
import React from 'react';
import styles from './PlayNow.module.css';

const PlayNowButton = ({ title, onClick }) => {
  return (
    <button className={styles.playNowButton} onClick={onClick}>
      {title}
    </button>
  );
};

export default PlayNowButton;
