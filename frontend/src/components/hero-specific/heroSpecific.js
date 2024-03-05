import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './heroSpecific.module.css';
import Modal from 'react-modal';
import SeriesDetails from "@/components/seriesDetails/seriesDeatils"
import PlayNowButton from '../PlayNow/PlayNow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown, faPlus, faInfo } from '@fortawesome/free-solid-svg-icons';
import videojs from 'video.js';
import VideoPlayer from '../videoPlayer/videoPlayer'; 
 import {
    faPlay,
    faPause,
    faArrowRotateRight,
    faArrowRotateBackward,
    faVolumeUp,
    faVolumeMute,
    faExpand,
    faCompress,
    faCog,
    faClosedCaptioning,
    faRandom,
    faArrowLeft,
    faExternalLinkAlt,
    faVolumeHigh,
    faStepForward
  } from '@fortawesome/free-solid-svg-icons';

const HeroSpecificSection = ({ seriesId, onTabChange, activeTab }) => {
  const [seriesData, setSeriesData] = useState(null);
  const [userVote, setUserVote] = useState(localStorage.getItem(`vote_${seriesId}`));
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);     
  const [isFullscreen, setIsFullscreen] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const [remainingTime, setRemainingTime] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1); 
  const [modalIsOpen, setIsOpen] = useState(false);
  const [SeriesDataModal, setSeriesDataModal] = useState(null); 


  
  const videoRef = useRef(null);
  const previewTimeoutRef = useRef(null); 
 
const handleAddToWatchlist = async (contentId, contentType) => {
  try {
    const response = await axios.post('http://localhost:3001/api/watchlist/add', {
      content_id: contentId,
      content: contentType,
    }, { withCredentials: true });

    if (response.status === 200) {
      console.log("Content added to watchlist");
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
  }
};


  useEffect(() => {
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
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const formatTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };
  // const handleVote = async (voteType) => {
  //   const userProfile = localStorage.getItem('userProfile');
  
  //   if (!userProfile) {
  //     alert('You must be logged in to vote.');
  //     return;
  //   }
  
  //   let newVoteType = voteType === userVote ? null : voteType;
  
  //   // Update UI optimistically
  //   setUserVote(newVoteType);
  //   // Persist vote to localStorage
  //   localStorage.setItem(`vote_${seriesId}`, newVoteType || '');
  
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:3001/api/user/mediaRating/${voteType}`, // Ensure this URL is correct
  //       {
  //         table_name: 'series',
  //         content_id: seriesId,
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json', // Ensure server expects JSON
  //         },
  //         withCredentials: true,
  //       }
  //     );
  
  //     // Handle response if needed
  //   } catch (error) {
  //     console.error(`Failed to submit vote:`, error);
  //     alert('Failed to record your vote. Please try again.');
  //   }
  // };
  
  
  const handleVote = async (voteType) => {
    const userProfile = localStorage.getItem('userProfile');
    
    if (!userProfile) {
      alert('You must be logged in to vote.');
      return;
    }
    
    let newVoteType = voteType === userVote ? null : voteType;
    
    setUserVote(newVoteType);
    localStorage.setItem(`vote_${seriesId}`, newVoteType || '');
  
    setSeriesData(currentData => {
      const newData = { ...currentData };
      if (voteType === 'up') {
        if (newVoteType) {
          newData.series_upvotes += 1;
          if (userVote === 'down') {
            newData.series_downvotes -= 1;
          }
        } else {
          newData.series_upvotes -= 1;
        }
      } else if (voteType === 'down') {
        if (newVoteType) {
          newData.series_downvotes += 1;
          if (userVote === 'up') {
            newData.series_upvotes -= 1;
          }
        } else {
          newData.series_downvotes -= 1;
        }
      }
      return newData;
    });
  
    try {
      await axios.post(
        `http://localhost:3001/api/user/mediaRating/${voteType}`, 
        {
          table_name: 'series',
          content_id: seriesId,
        },
        {
          headers: {
            'Content-Type': 'application/json', 
          },
          withCredentials: true,
        }
      );

    } catch (error) {
      console.error(`Failed to submit vote:`, error);
      alert('Failed to record your vote. Please try again.');
    }
  };
  

  useEffect(() => {
    let player;
    if (isVideoModalOpen && videoRef.current) {
      player = videojs(videoRef.current, videoJsOptions, function onPlayerReady() {
        console.log('Player is ready');
        this.play();
        this.on('timeupdate', () => {
          const progress = (this.currentTime() / this.duration()) * 100;
          setProgress(progress);
          const remaining = this.duration() - this.currentTime();
          setRemainingTime(remaining);
        });
      });
      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));

      return () => {
        player.dispose();
      };
    }
  }, [isVideoModalOpen]);

  const handlePlayPause = () => {
    const player = videojs(videoRef.current);
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    } 
  };

  const handleSeek = (event) => {
    const player = videojs(videoRef.current);
    const seekTime = (event.target.value / 100) * player.duration();
    player.currentTime(seekTime);
  };
  const customControlsRef = useRef(null);

  const handleFullscreenToggle = () => {
    const player = videojs(videoRef.current);
    
    if (!player.isFullscreen()) {
      player.requestFullscreen();
      setIsFullscreen(true);
      if (customControlsRef.current) {
        customControlsRef.current.style.zIndex = '2147483647';
      }
    } else {
      player.exitFullscreen();
      setIsFullscreen(false);
      if (customControlsRef.current) {
        customControlsRef.current.style.zIndex = '1001'; 
      }
    }
  };
  const handleVolumeChange = (newVolume) => {
    const player = videojs(videoRef.current);
    
    if (newVolume !== undefined && !isNaN(newVolume)) {
      player.volume(newVolume);
      setIsMuted(newVolume === 0);
      setVolume(newVolume);
    } else {
      const isCurrentlyMuted = player.muted();
      if (isCurrentlyMuted) {
        player.muted(false);
        player.volume(volume); 
        setIsMuted(false);
      } else {
        setVolume(player.volume()); 
        player.muted(true);
        setIsMuted(true);
        setVolume(0); 
      }
    }
  };
const skipForward = () => {
    const player = videojs(videoRef.current);
    let newTime = player.currentTime() + 10;
    newTime = newTime > player.duration() ? player.duration() : newTime;
    player.currentTime(newTime);
  };

  const skipBackward = () => {
    const player = videojs(videoRef.current);
    let newTime = player.currentTime() - 10;
    newTime = newTime < 0 ? 0 : newTime;
    player.currentTime(newTime);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`http://localhost:3001/api/series/specific/${seriesId}`);
        if (res.data) {
          setSeriesData(res.data);
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

  useEffect(() => {
    async function fetchDataModal() {
      try {
        const res = await axios.get(`http://localhost:3001/api/series/seriesSummary/`);
        if (res.data) {
          setSeriesDataModal(res.data);
        } else {
          console.log('series not found');
          console.log(SeriesDataModal)
        }
      } catch (error) { 
        console.error('Fetching data failed', error);
      }
    }
    if (seriesId) {
      fetchDataModal();
    }
  }, [seriesId]);

  if (!seriesData) {
    return <div>Loading...</div>;
  }
  const handlePlayNowClick = () => {
    setIsVideoModalOpen(true); 
    setIsPreviewPlaying(false); 
  };

  
  const videoJsOptions = {
    autoplay: isPreviewPlaying,
    controls: false,
    muted: false, 
    sources: [{
      src: seriesData?.series_signed,
      type: 'video/mp4'
    }]
  };

  if (!seriesData) {
    return <div>Loading...</div>;
  }

  const totalVotes = seriesData.series_upvotes + seriesData.series_downvotes;
  const upvotePercentage = totalVotes > 0 ? (seriesData.series_upvotes / totalVotes * 100).toFixed(0) : 0;
  const downvotePercentage = totalVotes > 0 ? (seriesData.series_downvotes / totalVotes * 100).toFixed(0) : 0;

  const upvoteColor = userVote === 'up' ? 'blue' : 'white'; 
  const downvoteColor = userVote === 'down' ? 'blue' : 'white';
  const iconStyle = (voteType) => ({
    color: userVote === voteType ? 'blue' : 'white',
    transform: userVote === voteType ? 'scale(1.25)' : 'scale(1)',
    transition: 'transform 0.3s ease',
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
          <PlayNowButton title="Play Now" onClick={handlePlayNowClick} className={styles.playButton} />
          <FontAwesomeIcon
            className={`${styles.iconCircle} ${styles.plusSign}`}
            icon={faPlus}
            onClick={() => handleAddToWatchlist(seriesId, "series")} 
          />            
        <FontAwesomeIcon
          icon={faInfo}
          className={`${styles.iconCircle} ${styles.infoButton}`}
          onClick={openModal}
        />
          </div> 
           <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            // backgroundColor: 'rgba(0, 0, 0, 0.75)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            width: '50%'

            
          }
        }}        overlayClassName="yourOverlayClass" 
        contentLabel="Series Details"
      >
        <div className={styles.modalContent}>
        <h2>{SeriesDataModal?.series_name}</h2>
        <h2>{SeriesDataModal?.series_status}</h2>
        <h2>{SeriesDataModal?.series_starring}</h2>

        <h2>{SeriesDataModal?.genres}</h2>

        <SeriesDetails seriesId={seriesId} />

          <button onClick={closeModal} className={styles.closeButton}>Close</button>
        </div>
      </Modal>
        </div> 
      </div>
      <div className={styles.sliderBarContainer}>
        <p className={`${styles.sliderBar} ${activeTab === 'episodes' ? styles.underlineTab : ''}`} onClick={() => onTabChange('episodes')}>Episodes</p>
        <p className={`${styles.sliderBar} ${activeTab === 'related' ? styles.underlineTab : ''}`} onClick={() => onTabChange('related')}>Related</p>
        <p className={`${styles.sliderBar} ${activeTab === 'discussions' ? styles.underlineTab : ''}`} onClick={() => onTabChange('discussions')}>Discussions</p>
        <p className={`${styles.sliderBar} ${activeTab === 'behindTheScenes' ? styles.underlineTab : ''}`} onClick={() => onTabChange('behindTheScenes')}>Behind the Scenes</p>
        <p className={`${styles.sliderBar} ${activeTab === 'details' ? styles.underlineTab : ''}`} onClick={() => onTabChange('details')}>Details</p>
      </div>
      {isVideoModalOpen && (
  <div className={styles.videoModal}>
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" />
    </div>
    <div className={styles.topLeftControls}>
      <button className={styles.backButton} onClick={() => setIsVideoModalOpen(false)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </div>
    <div className={styles.topRightControls}>
      <button className={styles.customButton}>
        <FontAwesomeIcon icon={faExternalLinkAlt} />
      </button>
    </div>
    <div className={styles.mediaContainer}>
      <div className={styles.trackbarContainer}>
        <input
          type="range"
          min="0" 
          max="100"
          value={progress}
          onChange={handleSeek}
          className={styles.trackbar}
          style={{ zIndex: 1002 }}
        />
        <div className={styles.remainingTime} style={{ zIndex: 1002 }}>
          {formatTime(remainingTime)}
        </div>
      </div>
      <div ref={customControlsRef} className={styles.customControlsContainer}>
        <div className={styles.leftControls}>
          <button className={`${styles.customButton} ${styles.customPlayButton}`} onClick={handlePlayPause}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button className={styles.customButton} onClick={skipBackward}>
            <FontAwesomeIcon icon={faArrowRotateBackward} />
          </button>
          <button className={styles.customButton} onClick={skipForward}>
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </button>
          <button className={styles.customButton} onClick={() => handleVolumeChange()}>
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
          </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className={styles.volumeSlider}
        />
        </div>
        <div className={styles.rightControls}>
          <button className={styles.customButton}>
            <FontAwesomeIcon icon={faStepForward} />
          </button>
          <button className={styles.customButton}>
            <FontAwesomeIcon icon={faClosedCaptioning} />
          </button>
          <button className={styles.customButton}>
            <FontAwesomeIcon icon={faCog} />
          </button>
          <button className={styles.customButton} onClick={handleFullscreenToggle}>
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
          </button>
        </div>
      </div>
    </div>
    <button className={styles.modalCloseButton} onClick={() => setIsVideoModalOpen(false)}>
      &times;
    </button>
  </div>
)}
    </div>
  );
};

export default HeroSpecificSection;
