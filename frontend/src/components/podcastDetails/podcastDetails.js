import React from 'react';
import styles from './podcastDetails.module.css'; 
import { formatDistanceToNow } from 'date-fns';

const PodcastDetails = ({ details }) => {
  if (!details) return <p>Loading details...</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className={styles.detailsContainer}>
      <h1 className={styles.title}>{details.podcast_name}</h1>
      <p className={styles.detail}><span className={styles.label}>Type:</span> <span className={styles.detailValue}>{details.podcast_type}</span></p>
      <p className={styles.detail}><span className={styles.label}>Main:</span> <span className={styles.detailValue}>{details.podcast_main}</span></p>
      <p className={styles.detail}><span className={styles.label}>Starring:</span> <span className={styles.detailValue}>{details.podcast_starring}</span></p>
      <p className={styles.detail}><span className={styles.label}>Directors:</span> <span className={styles.detailValue}>{details.podcast_directors}</span></p>
      <p className={styles.detail}><span className={styles.label}>Producers:</span> <span className={styles.detailValue}>{details.podcast_producers}</span></p>
      <p className={styles.detail}><span className={styles.label}>Country:</span> <span className={styles.detailValue}>{details.country_name}</span></p>
      <p className={styles.detail}><span className={styles.label}>Release:</span> <span className={styles.detailValue}>{formatDate(details.date_created)}</span></p>
      <p className={styles.detail}><span className={styles.label}>Upvotes:</span> <span className={styles.detailValue}>{details.podcast_upvotes}</span></p>
      <p className={styles.detail}><span className={styles.label}>Downvotes:</span> <span className={styles.detailValue}>{details.podcast_downvotes}</span></p>
    </div>
  ); 
};

export default PodcastDetails;
