import React from 'react';
import Image from 'next/image';
import './YoutubeIcon.css';
import YoutubeLogo from '../../assets/youtube-icon-white.svg'; 

export const YoutubeIcon = () => {
  return (
    <div className="youtube-icon">
      <Image src={YoutubeLogo} alt="Youtube" width={24} height={24} />
    </div>
  );
};
