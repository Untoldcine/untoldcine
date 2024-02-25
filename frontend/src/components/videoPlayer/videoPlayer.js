import React, { useState, useEffect, useRef } from 'react';

function VideoPlayer(props) {
  // States for video controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume (0.0 to 1.0)
  const [playbackRate, setPlaybackRate] = useState(1.0); // Default playback rate
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Ref for the video element
  const videoRef = useRef(null);

  // Effect to handle component mount and updates based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Function to toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to change volume
  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
    videoRef.current.volume = volume;
  };

  // Function to change playback rate
  const handlePlaybackRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };

  // Function to update current time
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  // Function to seek in the video
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Function to handle video load metadata
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  return (
    <div className="video-player">
      <video
        src={props.src}
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      ></video>
      <div className="controls">
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
        <select value={playbackRate} onChange={handlePlaybackRateChange}>
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
        <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek} />
        <div>{Math.round(currentTime)} / {Math.round(duration)}</div>
      </div>
    </div>
  );
}

export default VideoPlayer;
