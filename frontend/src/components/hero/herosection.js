import React from 'react';
import styles from './hero.module.css'; 
import heroImage from '../../../src/assets/MovieThumbnail.png';
import titleImage from '../../../public/assets/MovieThumbnail.png'; 
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
        </div>
        <div className={styles.metaContainer}>
          <div className={styles.ratings}>
            <span className={styles.rating}>85%</span>
            <span className={styles.userRating}>15%</span>
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
          <button className={styles.playButton}>Play Now</button>
          <button className={styles.addButton}>+</button>
          <button className={styles.infoButton}>i</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
