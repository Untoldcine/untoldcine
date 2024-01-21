import React from 'react';
import Image from 'next/image';
import styles from './NavBarSignedIn.module.css';
import UntoldLogo from "../../assets/UntoldLogoHeader.svg"
import SearchBar from "../../components/SearchBar/SearchBar"

export const NavBarSignedIn = () => {
  return (
    <nav className={styles.navbar}> 
    <div className={styles.logoContainer}>
        <Image src={UntoldLogo} alt="Logo" width={140} height={82} />
    </div>
    <ul className={styles.navList}>
        <li>Home</li>
        <li>Behind-the-scenes</li>
        <li>Podcasts</li>
        <li>Watchlists</li>
        <li>Live Events</li>
        <li>News Feed</li>
    </ul>
    <div className={styles.navButtons}>

    </div>
</nav>
  );
};
