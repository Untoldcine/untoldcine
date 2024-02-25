import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './heroSpecificPodcast.module.css';
import PlayNowButton from '../PlayNow/PlayNow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown, faPlus, faInfo } from '@fortawesome/free-solid-svg-icons';


const HeroSpecificPodcast = ({ podcastId, onTabChange, activeTab  }) => {
  const [podcastData, setPodcastData] = useState(null);

  useEffect(() => { 
    async function fetchData() {
      try {
        const res = await axios.get(`http://localhost:3001/api/podcast/podcastSummary/`);
        const podcast = res.data.find(s => s.podcast_id === podcastId);
        if (podcast) {
          setPodcastData(podcast);
        } else {
          console.log('podcast not found');
        }
      } catch (error) {
        console.error('Fetching data failed', error);
      }
    }
    if (podcastId) {
      fetchData(); 
    }
  }, [podcastId]);

  if (!podcastData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.hero} style={{ backgroundImage: `url(${podcastData.podcast_thumbnail})` }}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{podcastData.podcast_name}</h2>
          <div className={styles.metaContainer}>
            <PlayNowButton title="Season 1" className={styles.seasonButton} />
            <p className={styles.summaryContainer}>{podcastData.podcast_main}</p>
            <div className={styles.ratings}>
              <FontAwesomeIcon icon={farThumbsUp} /> <span className={styles.rating}>85%</span>
              <FontAwesomeIcon icon={farThumbsDown} /> <span className={styles.userRating}>15%</span>
            </div>
            <div className={styles.info}>
              <span className={styles.year}>2023</span>
              <span className={styles.separator}>|</span>
              {/* <span className={styles.genres}>
                {podcastData.genres.join(', ')}
              </span> */}
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
        <p className={`${styles.sliderBar} ${activeTab === 'episodes' ? styles.underlineTab : ''}`} onClick={() => onTabChange('episodes')}>Episodes</p>
        <p className={`${styles.sliderBar} ${activeTab === 'related' ? styles.underlineTab : ''}`} onClick={() => onTabChange('related')}>Related</p>
        <p className={`${styles.sliderBar} ${activeTab === 'discussions' ? styles.underlineTab : ''}`} onClick={() => onTabChange('discussions')}>Discussions</p>
        <p className={`${styles.sliderBar} ${activeTab === 'behindTheScenes' ? styles.underlineTab : ''}`} onClick={() => onTabChange('behindTheScenes')}>Behind the Scenes</p>
        <p className={`${styles.sliderBar} ${activeTab === 'details' ? styles.underlineTab : ''}`} onClick={() => onTabChange('details')}>Details</p>
      </div>
    </div>
  );
};

export default HeroSpecificPodcast;
