import React from 'react';
import styles from './hero.module.css'; 
import heroImage from '../../../src/assets/MovieThumbnail.png';
import titleImage from '../../../public/assets/MovieThumbnail.png'; 
import PlayNowButton from '../PlayNow/PlayNow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faPlusCircle, faInfoCircle,  } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

const titleImagePath = '/assets/hero.png';

const HeroSection = () => {
  const titleImagePath = '/assets/heroTitle.png';
  const heroImagePath = '/assets/hero.png';

  return (
    <div className={styles.hero}>
      <img src={heroImagePath} alt="Hero Background" className={styles.heroImage} />
      
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <img src={titleImagePath} alt="Title" className={styles.titleImage} />
          <div className={styles.metaContainer}>
          <div className={styles.ratings}>
          <FontAwesomeIcon icon={farThumbsUp} /> <span className={styles.rating}>85%</span>
          <FontAwesomeIcon icon={farThumbsDown} /> <span className={styles.userRating}>15%</span>
          </div>
          <div className={styles.info}>
            <span className={styles.year}>2023</span>
            <span className={styles.separator}>|</span>
            <span className={styles.genres}>Drama, Adventure, Action</span>
            <span className={styles.separator}>|</span>
            <span className={styles.duration}>1 h 28 min</span>
          </div>
        </div>
        <div className={styles.actions}>
        <PlayNowButton className={styles.playButton}/>
        <FontAwesomeIcon className={`${styles.iconCircle} ${styles.plusSign}`} icon={faPlus} />
        <FontAwesomeIcon className={`${styles.iconCircle} ${styles.infoButton}`} icon={faInfo} />
        </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
