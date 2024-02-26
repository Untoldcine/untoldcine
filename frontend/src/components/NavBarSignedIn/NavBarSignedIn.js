import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './NavBarSignedIn.module.css';
import UntoldLogo from "../../assets/UntoldLogoHeader.svg";
import { faBars, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'; // Ensure you have imported faSearch and faUser
import Link from 'next/link';

export const NavBarSignedIn = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Image src={UntoldLogo} alt="Logo" width={140} height={82} />
      </div>
      <button
        className={styles.hamburgerButton}
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
      <ul className={`${styles.navList} ${isNavExpanded ? styles.show : ''}`}>
        <Link href='/test'>
          <li>Home</li>
        </Link>
        <li>Behind-the-scenes</li>
        <li>Podcasts</li>
        <li>Watchlists</li> 
        <li>Live Events</li>
        <li>News Feed</li>
      </ul>
      <div className={styles.searchAndProfile}>
        <div className={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input type="search" placeholder="Search" className={styles.searchInput} />
        </div>
        <div className={styles.profileIconContainer}>
          <FontAwesomeIcon icon={faUser} size="lg" className={styles.profileIcon} />
        </div>
      </div>
    </nav>
  );  
};
