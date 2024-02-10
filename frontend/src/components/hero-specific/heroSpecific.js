import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './heroSpecific.module.css';
import PlayNowButton from '../PlayNow/PlayNow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown, faPlus, faInfo } from '@fortawesome/free-solid-svg-icons';

const titleImagePath = '/assets/heroTitle.png';

const HeroSpecificSection = ({ seriesId }) => {
  const [seriesData, setSeriesData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`http://localhost:3001/api/series/seriesSummary/`);
        const series = res.data.find(s => s.series_id === seriesId);
        if (series) {
          setSeriesData(series);
        } else {
          console.log('Series not found');
        }
      } catch (error) {
        console.error('Fetching data failed', error);
      }
    }
    if (seriesId) {
      fetchData();
    }
  }, [seriesId]);

  if (!seriesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.hero} style={{ backgroundImage: `url(${seriesData.series_thumbnail})` }}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <img src={titleImagePath} alt="Title" className={styles.titleImage} />
          <div className={styles.metaContainer}>
            <PlayNowButton title="Season 1" className={styles.seasonButton} />
            <p className={styles.summaryContainer}>{seriesData.series_description}Scarred by the Second Impact, the Fourth Angel attacks Tokyo III and humanity's
            fate is left in the Special Government Agency NERV's hands. Young Shinji Ikari is forced to pilot EVA-01.
            He and EVA-00 pilot Rei Awanami are tasked to fight, but EVA-01 is damaged by the Sixth Angel.
            Misato Katsuragi draws up a plan to focus all of Japan's electricity.</p>            <div className={styles.ratings}>
              <FontAwesomeIcon icon={farThumbsUp} /> <span className={styles.rating}>85%</span>
              <FontAwesomeIcon icon={farThumbsDown} /> <span className={styles.userRating}>15%</span>
            </div>
            <div className={styles.info}>
              <span className={styles.year}>2023</span>
              <span className={styles.separator}>|</span>
              {/* Dynamically render genres */}
              <span className={styles.genres}>
                {seriesData.genres.join(', ')}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.duration}>1 h 28 min</span>
            </div>
          </div>
          <div className={styles.actions}>
            <PlayNowButton title="Play Now" className={styles.playButton} />
            <FontAwesomeIcon className={`${styles.iconCircle} ${styles.plusSign}`} icon={faPlus} />
            <FontAwesomeIcon className={`${styles.iconCircle} ${styles.infoButton}`} icon={faInfo} />
          </div>
        </div>
      </div>
      <div className={styles.sliderBarContainer}> 
          <p className={styles.sliderBar}>Episodes</p>
          <p className={styles.sliderBar}>Related</p>
          <p className={styles.sliderBar}>Discussions</p>
          <p className={styles.sliderBar}>Behind the Scenes</p>
          <p className={styles.sliderBar}>Details</p>
      </div>
    </div>
  );
};

export default HeroSpecificSection;
