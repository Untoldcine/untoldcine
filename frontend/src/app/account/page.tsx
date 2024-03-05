'use client'

import React from 'react';
import styles from './page.module.css'; 
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn';

function AccountComponent() {
  return (
    <div> 
    <NavBarSignedIn />
    <div className={styles.accountContainer}>
      <h2 className={styles.accountHeader}>Account & Settings</h2>
      
      <div className={styles.accountSection}>
        <h3 className={styles.headings}>Account Details</h3>
        <div className={styles.accountInfo}>
          <p>JohnDoe@mail.com</p>
          <button className={styles.editButton}>Edit</button>
        </div>
        <div className={styles.accountInfo}>
          <p>Password: ********</p>
          <button className={styles.editButton}>Edit</button>
        </div>
      </div>
      
      <div className={styles.accountSection}>
        <h3 className={styles.headings}>Subscription</h3>
        <div className={styles.subscriptionInfo}>
          <p>Basic Plan With Ads</p>
          <button className={styles.nextButton}></button>
        </div>
        <div className={styles.subscriptionInfo}>
          <p>Billing History</p>
          <button className={styles.nextButton}></button>
        </div>
        <div className={styles.subscriptionInfo}>
          <p>Change your plan</p>
          <button className={styles.nextButton}></button>
        </div>
      </div>
      
      <button className={styles.signOutButton}>Sign Out</button>
    </div>
    </div>
  );
}

export default AccountComponent;
