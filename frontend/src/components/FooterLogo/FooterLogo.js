import React from 'react';
import Image from 'next/image';
import './FooterLogo.css';
import UntoldFooterLogo from '../../assets/UntoldLogoHeader.svg'; 

export const FooterLogo = () => {
  return (
    <div className="footer-logo">
      <Image src={UntoldFooterLogo} alt="Logo" width={62} height={62} className='footer-logo' />
      <p className='footer-logo-text'>UNTOLD UNIVERSE Inc. 2023</p>
    </div>
  );
};
