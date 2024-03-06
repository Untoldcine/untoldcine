  'use client'
  import React, { useState, useRef, useEffect } from 'react';
  import styles from './hero.module.css';
  import videojs from 'video.js';
  import 'video.js/dist/video-js.css';
  import PlayNowButton from '../PlayNow/PlayNow';
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

  const HeroSection = () => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);     
    const [isFullscreen, setIsFullscreen] = useState(false); 
    const [progress, setProgress] = useState(0); 
    const [remainingTime, setRemainingTime] = useState(0);

    const videoRef = useRef(null);
    const titleImagePath = '/assets/HeroTitle.png';
    const heroImagePath = '/assets/hero.png';
    const videoUrl = './assets/TestVideo1.mp4';

    const videoJsOptions = {
      autoplay: true, 
      controls: false,
      muted: true, 
      sources: [{
        src: videoUrl,
        type: 'video/mp4'
      }]
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
          customControlsRef.current.style.zIndex = '1001'; // Set it back to your original z-index
        }
      }
    };
    

    const formatTime = (seconds) => {
      const date = new Date(0);
      date.setSeconds(seconds);
      return date.toISOString().substr(11, 8);
    };

    // Functionality for skipping forward and backward
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
              <PlayNowButton title="Play Now" onClick={() => {setIsVideoModalOpen(true);}} className={styles.playButton} />  
                        <FontAwesomeIcon className={`${styles.iconCircle} ${styles.plusSign}`} icon={faPlus} />
                <FontAwesomeIcon className={`${styles.iconCircle} ${styles.infoButton}`} icon={faInfo} />
              </div>
            </div>
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
        <div className={styles.trackbarContainer}>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className={styles.trackbar}
        style={{ zIndex: 1002 }} // Ensure this is on top
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

          <button className={styles.customButton}>
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
          </button>
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
      <button className={styles.modalCloseButton} onClick={() => setIsVideoModalOpen(false)}>
        &times;
      </button>
    </div>
  )}
        </div>
      );
    };

    export default HeroSection;
