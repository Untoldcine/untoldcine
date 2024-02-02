import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css'; 
import UntoldFooterLogo from '../../assets/Logo.svg'; 
import { SocialBar } from "@/components/SocialIconBar/SocialIconBar"; 

export const Footer = () => {
  return (
    <div className={styles.footer}> 
        <SocialBar />
        <Image src={UntoldFooterLogo} alt="Logo" width={62} height={62} />
        <p className={styles.footerLogoText}>UNTOLD UNIVERSE Inc. 2023</p> 
    </div>
  );
};
