import React from 'react';
import styles from './card.module.css'; 

const Card = ({ title, imageUrl }) => {
  return (  
    <div className={styles.card}>
      <img src={imageUrl} alt={title} className={styles.cardImage} />
      <div className={styles.cardTitle}>{title}</div>
    </div>
  );
};

export default Card;