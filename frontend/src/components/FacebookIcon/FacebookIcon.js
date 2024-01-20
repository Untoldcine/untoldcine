import React from 'react';
import Image from 'next/image';
import './FacebookIcon.css';
import FacebookLogo from '../../assets/facebook-icon-white.svg'; 

export const FacebookIcon = () => {
  return (
    <div className="facebook-icon">
      <Image src={FacebookLogo} alt="Facebook" width={24} height={24} />
    </div>
  );
};
 