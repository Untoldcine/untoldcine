'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './NavBar.module.css';
import UntoldLogo from "../../assets/UntoldLogoHeader.svg"
import { SecondaryButton } from '../SecondaryButton/SecondaryButton';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import Link from 'next/link';
import { faBars, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'; 

export const NavBar = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

    const getItemWithExpiry = (key: string) => {
        const itemStr = localStorage.getItem(key);
    
        // If the item doesn't exist, return null
        if (!itemStr) {
            return null;
        }
    
        const item = JSON.parse(itemStr);
        const now = new Date();
    
        // Compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem(key);
            return null;
        }
    
        return item.value;
    };

    useEffect(() => {
        const loggedIn = getItemWithExpiry('untoldcine-loggedin'); 
               
        if (loggedIn === 'true') {
            setIsUserSignedIn(true)            
        }
        else {
            setIsUserSignedIn(false)
        }
    }, []);

    if (!isUserSignedIn) {
        return (
            <nav className={styles.navbar}>
              <Link className={styles.logoContainer} href = '/home'>
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
                <li>Watchlists</li> 
              </ul>
              <div className={`${styles.navButtons} ${isNavExpanded ? styles.showButtons : ''}`}>
                <Link href="/sign-up" passHref>
                  <SecondaryButton className={styles.customSecondaryButton}>Sign Up</SecondaryButton>
                </Link>
                <Link className={styles.signButton} href="/sign-in" passHref>
                  <PrimaryButton className={styles.customPrimaryButton}>Login</PrimaryButton>
                </Link>
              </div>
            </nav>
          );  
    }
    else {
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
    }
  
};
