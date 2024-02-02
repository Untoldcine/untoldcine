import React from 'react';
import './SocialIconBar.css';
import { FacebookIcon } from '../FacebookIcon/FacebookIcon'; 
import { YoutubeIcon } from '../YoutubeIcon/YoutubeIcon'; 
import { InstagramIcon } from '../InstagramIcon/InstagramIcon'; 
import { TwitterIcon } from '../TwitterIcon/TwitterIcon'; 
import { TikTokIcon } from '../TikTokIcon/TikTokIcon'; 

export const SocialBar = () => {
  return (
    <div className="social-bar">
      <FacebookIcon />
      <InstagramIcon />
      <YoutubeIcon />
      <TwitterIcon />
      <TikTokIcon />
    </div>
  );
};
