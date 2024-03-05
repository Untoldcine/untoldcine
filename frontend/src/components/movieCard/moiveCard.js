import React from 'react';
import styles from './moiveCard.module.css'; 
import Link from "next/link";

const MovieCard = ({ imageUrl, title, movieId }) => {

  const moviePageUrl = `/movieDetailed/${title}/${movieId}`;

  return (
    <Link href={moviePageUrl}>
      <div className={styles.cardLink}>
        <div className={styles.card}>
          <img src={imageUrl} alt={title} className={styles.cardImage} />
          {/* <div className={styles.cardTitle}>{title}</div> */}
        </div>
      </div>
    </Link> 
  );
};

export default MovieCard;
