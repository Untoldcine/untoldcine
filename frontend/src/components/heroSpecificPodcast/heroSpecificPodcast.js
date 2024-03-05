import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './heroSpecificPodcast.module.css';
import PlayNowButton from '../PlayNow/PlayNow';
import videojs from 'video.js';
import VideoPlayer from '../videoPlayer/videoPlayer'; 
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn.js';
import Modal from 'react-modal';
import PodcastDetails from '../podcastDetails/podcastDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import {
    faThumbsUp as farThumbsUp,
    faThumbsDown as farThumbsDown,
    faPlus, 
    faInfo,
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
const HeroSpecificPodcast = ({ podcastId, onTabChange, activeTab }) => {
  const [podcastData, setPodcastData] = useState(null);
  const [contentData, setContentData] = useState([]);
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
   
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
      setContentData(res.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreviewPlaying(false); 
    }, 10000); 

    return () => clearTimeout(timer);
  }, []);


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
  

  const formatTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
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
        const res = await axios.get(`http://localhost:3001/api/podcast/specific/${podcastId}`);
        if (res.data) {
          setPodcastData(res.data);
        } else {
          console.log('Podcast not found');
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
  const handlePlayNowClick = () => {
    setIsVideoModalOpen(true); 
    setIsPreviewPlaying(false); 
  };

  
  const videoJsOptions = {
    autoplay: isPreviewPlaying,
    controls: false,
    muted: false, 
    sources: [{
      src: podcastData?.podcast_signed,
      type: 'video/mp4'
    }]
  };

  return (
    <div className={styles.hero} style={{ backgroundImage: `url(${podcastData.podcast_thumbnail})` }}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{podcastData.podcast_name}</h2>
          <div className={styles.metaContainer}>
            <p className={styles.summaryContainer}>{podcastData.podcast_main}</p>
            <div className={styles.ratings}>
              <FontAwesomeIcon icon={farThumbsUp} /> <span className={styles.rating}>85%</span>
              <FontAwesomeIcon icon={farThumbsDown} /> <span className={styles.userRating}>15%</span>
            </div>
            <div className={styles.info}>
              <span className={styles.year}>2023</span>
              <span className={styles.separator}>|</span>
              {/* Uncomment and adjust the genres display logic as needed */}
              {/* <span className={styles.genres}>
                {podcastData.genres.join(', ')}
              </span> */}
              <span className={styles.separator}>|</span>
              <span className={styles.duration}>1 h 28 min</span>
            </div>
          </div>
          <div className={styles.actions}>
            <PlayNowButton title="Play Now" onClick={handlePlayNowClick} className={styles.playButton} />
            <FontAwesomeIcon
            className={`${styles.iconCircle} ${styles.plusSign}`}
            icon={faPlus}
            onClick={() => handleAddToWatchlist(podcastId, "podcast")} 
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

            
            // Add more styling here
          }
        }}        overlayClassName="yourOverlayClass" 
        contentLabel="Series Details"
      >
        <div className={styles.modalContent}>
        <h2>{podcastData?.podcast_name}</h2>
        <p>Type: {podcastData?.podcast_type}</p>
        <p>Starring: {podcastData?.podcast_starring}</p>
        <p>Director: {podcastData?.podcast_directors}</p>
        <p>Producer: {podcastData?.podcast_producers}</p>

        <h2>{podcastData?.genres}</h2>

        {/* <PodcastDetails podcastId={podcastId} /> */}

          <button onClick={closeModal} className={styles.closeButton}>Close</button>
        </div>
      </Modal>
        </div>
      </div>
      <div className={styles.sliderBarContainer}>
        <p className={`${styles.sliderBar} ${activeTab === 'episodes' ? styles.underlineTab : ''}`} onClick={() => onTabChange('episodes')}>Episodes</p>
        <p className={`${styles.sliderBar} ${activeTab === 'related' ? styles.underlineTab : ''}`} onClick={() => onTabChange('related')}>Related</p>
        <p className={`${styles.sliderBar} ${activeTab === 'discussions' ? styles.underlineTab : ''}`} onClick={() => onTabChange('discussions')}>Discussions</p>
        <p className={`${styles.sliderBar} ${activeTab === 'behindTheScenes' ? styles.underlineTab : ''}`} data-tab-name="BTS" onClick={() => onTabChange('behindTheScenes')}>Behind the Scenes</p>
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

export default HeroSpecificPodcast;
