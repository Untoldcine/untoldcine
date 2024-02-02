import React from 'react';
import Image from 'next/image';
import './TikTokIcon.css';
import TikTokLogo from '../../assets/tiktok-icon-white.png'; 

export const TikTokIcon = () => {
  return (
    <div className="tiktok-icon">
      <Image src={TikTokLogo} alt="TikTok" width={24} height={24} />
    </div>
  );
};
