import React from 'react';
import styles from './podcastCard.module.css'; 
import Link from "next/link";

const PodcastCard = ({ imageUrl, title, podcastId }) => {

  const podcastPageUrl = `/podcastDetailed/${title}/${podcastId}`;

  return (
    <Link href={podcastPageUrl}>
      <div className={styles.cardLink}>
        <div className={styles.card}>
          <img src={imageUrl} alt={title} className={styles.cardImage} />
          {/* <div className={styles.cardTitle}>{title}</div> */}
        </div>
      </div>
    </Link> 
  );
};

export default PodcastCard;
