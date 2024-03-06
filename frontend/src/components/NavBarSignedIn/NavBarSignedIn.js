import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Image from 'next/image';
import Account from '@/components/account/account';
import styles from './NavBarSignedIn.module.css';
import UntoldLogo from "../../assets/UntoldLogoHeader.svg";
import { faBars, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'; 
import Link from 'next/link';

export const NavBarSignedIn = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Link className={styles.logoContainer} href = "/home"> 
        <Image src={UntoldLogo} alt="Logo" width={140} height={82} />
      </Link>
      <button
        className={styles.hamburgerButton}
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
      <ul className={`${styles.navList} ${isNavExpanded ? styles.show : ''}`}>
        <Link href='/home'>
          <li>Home</li>
        </Link>
        <Link href='/bts'> 
          <li>Behind The Scenes</li>
        </Link>
        <Link href='/podcasts'> 
          <li>Podcasts</li>
        </Link>
        <Link href='/watchlist'> 
        <li>Watchlists</li>
        </Link> 
        <li>News Feed</li>
      </ul>
      <div className={styles.searchAndProfile}>
        <div className={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input type="search" placeholder="Search" className={styles.searchInput} />
        </div>
        <div className={styles.profileIconContainer}>
          <Link href="/account"> 
          <FontAwesomeIcon icon={faUser} size="lg" className={styles.profileIcon} />
          </Link>
        </div>
      </div>
    </nav>
  );  
};
