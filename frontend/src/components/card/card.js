import React from 'react';
import styles from './card.module.css'; 
import Link from "next/link";

const Card = ({ imageUrl, title, seriesId }) => {

  const seriesPageUrl = `/detailed/${title}/${seriesId}`;

  return (
    <Link href={seriesPageUrl}>
      <div className={styles.cardLink}>
        <div className={styles.card}>
          <img src={imageUrl} alt={title} className={styles.cardImage} />
          {/* <div className={styles.cardTitle}>{title}</div> */}
        </div>
      </div>
    </Link> 
  );
};

export default Card;
