import React from 'react';
import Image from 'next/image';
import styles from './NavBarNotSignedIn.module.css';
import UntoldLogo from "../../assets/UntoldLogoHeader.svg"
import { SecondaryButton } from '../SecondaryButton/SecondaryButton';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import Link from 'next/link';
import { useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';


export const NavBarNotSignedIn = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Image src={UntoldLogo} alt="Logo" width={140} height={82} />
      </div>
      <button className={styles.hamburger} onClick={() => setIsNavExpanded(!isNavExpanded)}>
        {/* Icon for the hamburger menu */}
      </button>
      
      {isNavExpanded && (
        <ul className={styles.navList}>
          <li>Home</li>
          <li>Behind-the-scenes</li>
          <li>Podcasts</li>
          <li>Watchlists</li>
          <li>Live Events</li>
          <li>News Feed</li>
        </ul>
      )}
      
      {isNavExpanded && (
        <div className={styles.navButtons}>
          <Link href="/signup" passHref>
            <SecondaryButton as="a" className={styles.customSecondaryButton}>Sign Up</SecondaryButton>
          </Link>
          <Link href="/login" passHref>
            <PrimaryButton as="a" className={styles.customPrimaryButton}>Login</PrimaryButton>
          </Link>
        </div>
      )}
    </nav>
  ); 
};
