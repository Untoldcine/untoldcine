import React from 'react';
import Image from 'next/image';
import './TwitterIcon.css';
import TwitterLogo from '../../assets/twitter-icon-white.svg'; 

export const TwitterIcon = () => {
  return (
    <div className="twitter-icon">
      <Image src={TwitterLogo} alt="Twitter" width={24} height={24} />
    </div>
  );
};
