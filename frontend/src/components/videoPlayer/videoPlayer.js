import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Ensure the videoRef.current is not null
    if (videoRef.current) {
      // Initialize video.js on this video element
      playerRef.current = videojs(videoRef.current, options, function() {
        console.log('Player is ready');
        onReady && onReady(this);
      });
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        console.log('Player has been disposed');
      }
    };
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" playsInline></video>
    </div>
  );
};

export default VideoPlayer;
