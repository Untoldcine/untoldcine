import React from 'react';
import styles from './watchlistCard.module.css'; 

const WatchlistCard = ({ item, onRemoveFromWatchlist }) => {
  return (
    <div className={styles.card}>
      <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
      <div className={styles.info}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
        <button onClick={() => onRemoveFromWatchlist(item.id)} className={styles.removeButton}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default WatchlistCard;
