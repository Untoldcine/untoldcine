// VideoPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faArrowRotateRight,
  faArrowRotateBackward,
  faVolumeUp,
  faVolumeMute,
  faExpand,
  faCompress,
  faStepForward,
  faClosedCaptioning,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

const VideoPlayerTest = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume range is 0 to 1
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const player = videojs(videoRef.current, {
      autoplay: true,
      controls: false,
      sources: [{
        src: videoUrl,
        type: 'video/mp4',
      }],
    });

    player.on('timeupdate', () => {
      setProgress((player.currentTime() / player.duration()) * 100);
      setCurrentTime(player.currentTime());
    });

    player.on('durationchange', () => {
      setDuration(player.duration());
    });

    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));

    return () => {
      player.dispose();
    };
  }, [videoUrl]);

  const handlePlayPause = () => {
    const player = videojs(videoRef.current);
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const player = videojs(videoRef.current);
    player.volume(newVolume);
  };

  const handleSeek = (e) => {
    const time = (e.target.value / 100) * duration;
    const player = videojs(videoRef.current);
    player.currentTime(time);
  };

  const toggleFullscreen = () => {
    const player = videojs(videoRef.current);
    if (!player.isFullscreen()) {
      player.requestFullscreen();
      setIsFullscreen(true);
    } else {
      player.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Additional player controls (skip forward/back, etc.) go here

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    return date.toISOString().substr(11, 8);
  };

  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>
      <div className="video-controls">
        <button onClick={handlePlayPause}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <input type="range" min="0" max="100" value={progress} onChange={handleSeek} />
        <button onClick={toggleFullscreen}>
          <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
        </button>
        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
        <div>{formatTime(currentTime)} / {formatTime(duration)}</div>
      </div>
    </div>
  );
};

export default VideoPlayerTest;
