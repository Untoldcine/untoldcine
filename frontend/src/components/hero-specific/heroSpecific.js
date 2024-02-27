import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './heroSpecific.module.css';
import PlayNowButton from '../PlayNow/PlayNow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown, faPlus, faInfo } from '@fortawesome/free-solid-svg-icons';

const HeroSpecificSection = ({ seriesId, onTabChange, activeTab }) => {
  const [seriesData, setSeriesData] = useState(null);
  // Initialize userVote state from localStorage
  const [userVote, setUserVote] = useState(localStorage.getItem(`vote_${seriesId}`));

  useEffect(() => {
    // Fetch series details including votes
    const fetchSeriesDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/series/specific/${seriesId}`);
        setSeriesData(response.data);
      } catch (error) {
        console.error('Error fetching series details:', error);
      }
    };
    fetchSeriesDetails();
  }, [seriesId]);

  const handleVote = async (voteType) => {
    const userProfile = localStorage.getItem('userProfile');
  
    if (!userProfile) {
      alert('You must be logged in to vote.');
      return;
    }
  
    let newVoteType = voteType === userVote ? null : voteType;
  
    // Update UI optimistically
    setUserVote(newVoteType);
    // Persist vote to localStorage
    localStorage.setItem(`vote_${seriesId}`, newVoteType || '');
  
    try {
      const response = await axios.post(
        `http://localhost:3001/api/user/mediaRating/${voteType}`, // Ensure this URL is correct
        {
          table_name: 'series',
          content_id: seriesId,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure server expects JSON
          },
          withCredentials: true,
        }
      );
  
      // Handle response if needed
    } catch (error) {
      console.error(`Failed to submit vote:`, error);
      alert('Failed to record your vote. Please try again.');
    }
  };
  

  if (!seriesData) {
    return <div>Loading...</div>;
  }

  const totalVotes = seriesData.series_upvotes + seriesData.series_downvotes;
  const upvotePercentage = totalVotes > 0 ? (seriesData.series_upvotes / totalVotes * 100).toFixed(0) : 0;
  const downvotePercentage = totalVotes > 0 ? (seriesData.series_downvotes / totalVotes * 100).toFixed(0) : 0;

  // Determine icon colors based on userVote
  const upvoteColor = userVote === 'up' ? 'blue' : 'white'; 
  const downvoteColor = userVote === 'down' ? 'blue' : 'white';
  const iconStyle = (voteType) => ({
    color: userVote === voteType ? 'blue' : 'white',
    // Increase the size by 25% if the user has voted in this direction
    transform: userVote === voteType ? 'scale(1.25)' : 'scale(1)',
    transition: 'transform 0.3s ease', // Smooth transition for scaling
  });
  return (
    <div className={styles.hero} style={{ backgroundImage: `url(${seriesData.series_thumbnail})` }}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{seriesData.series_name}</h2>
          <div className={styles.metaContainer}>
            <PlayNowButton title="Season 1" className={styles.seasonButton} />
            <p className={styles.summaryContainer}>{seriesData.series_main}</p>
            <div className={styles.ratings}>
            <FontAwesomeIcon icon={farThumbsUp} style={iconStyle('up')} onClick={() => handleVote('up')} />
            <span className={styles.rating}>{upvotePercentage}%</span>
            <FontAwesomeIcon icon={farThumbsDown} style={iconStyle('down')} onClick={() => handleVote('down')} />
            <span className={styles.userRating}>{downvotePercentage}%</span>
              <span className={styles.totalVotes}>({totalVotes} votes)</span> 
            </div>
            <div className={styles.info}>
              <span className={styles.year}>2023</span>
              <span className={styles.separator}>|</span>
              <span className={styles.genres}>
                {/* {seriesData.genres.join(', ')} */}
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
        <p className={`${styles.sliderBar} ${activeTab === 'episodes' ? styles.underlineTab : ''}`} onClick={() => onTabChange('episodes')}>Episodes</p>
        <p className={`${styles.sliderBar} ${activeTab === 'related' ? styles.underlineTab : ''}`} onClick={() => onTabChange('related')}>Related</p>
        <p className={`${styles.sliderBar} ${activeTab === 'discussions' ? styles.underlineTab : ''}`} onClick={() => onTabChange('discussions')}>Discussions</p>
        <p className={`${styles.sliderBar} ${activeTab === 'behindTheScenes' ? styles.underlineTab : ''}`} onClick={() => onTabChange('behindTheScenes')}>Behind the Scenes</p>
        <p className={`${styles.sliderBar} ${activeTab === 'details' ? styles.underlineTab : ''}`} onClick={() => onTabChange('details')}>Details</p>
      </div>
    </div>
  );
};

export default HeroSpecificSection;
