import React from 'react';
import Image from 'next/image';
import './InstagramIcon.css';
import InstagramLogo from '../../assets/instagram-icon-white.svg'; 

export const InstagramIcon = () => {
  return (
    <div className="instagram-icon">
      <Image src={InstagramLogo} alt="Instagram" width={24} height={24} />
    </div>
  );
};
