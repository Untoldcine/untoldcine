import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './NavBarNotSignedIn.module.css';
import UntoldLogo from "../../assets/UntoldLogoHeader.svg"
import { SecondaryButton } from '../SecondaryButton/SecondaryButton';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import Link from 'next/link';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const NavBarNotSignedIn = () => {
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
        <Link href='/home'>
          <li>Home</li>
        </Link>
        <Link href='/bts'>
          <li>Behind The Scenes</li>
        </Link>     
        <Link href='/podcasts'> 
        <li>Podcasts</li>
        </Link>
        <li>Watchlists</li> 
        <li>News Feed</li>
      </ul>
      <div className={`${styles.navButtons} ${isNavExpanded ? styles.showButtons : ''}`}>
        <Link href="/sign-up" passHref>
          <SecondaryButton as="a" className={styles.customSecondaryButton}>Sign Up</SecondaryButton>
        </Link>
        <Link className={styles.signButton} href="/sign-in" passHref>
          <PrimaryButton as="a" className={styles.customPrimaryButton}>Login</PrimaryButton>
        </Link>
      </div>
    </nav>
  );  
};
