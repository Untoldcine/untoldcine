import React from 'react';
import styles from './btsCard.module.css'; 
import Link from "next/link";

const BtsCard = ({ imageUrl, title, btsId, contentType }) => {
  const pageUrl = contentType === 'movie' 
                  ? `/movieDetailed/${title}/${btsId}` 
                  : `/detailed/${title}/${btsId}`;

  return (
    <Link href={pageUrl}>
      <div className={styles.cardLink}> 
        <div className={styles.card}>
          <img src={imageUrl} alt={title} className={styles.cardImage} />

        </div>
      </div>
    </Link> 
  );
};

export default BtsCard;
