'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";
import PlayNowButton from "@/components/PlayNow/PlayNow";
import PlanToggle from "@/components/plan-toggle/plan-toggle"
export default function Home() {
    const [isAnnual, setIsAnnual] = useState(false);

  return (
    
    <main>
        <div className={styles.titleContainer}> 
        <h2 className={styles.Title}>Choose Your Plan</h2>
        <p className={styles.HerosubTitle}>Watch all you want. Reccomendations just for you. Change or cancel your plan anytime.</p>
        </div>
        <div className={styles.toggleContainer}>
          <button className={!isAnnual ? styles.active : styles.inactive} onClick={() => setIsAnnual(false)}>Monthly</button>
          <PlanToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          <button className={isAnnual ? styles.active : styles.inactive} onClick={() => setIsAnnual(true)}>Annually</button>
        </div>
        <div className={styles.main}> 
      <div className={styles.popup}>
        <h4 className={styles.title}>Basic</h4>
        <h4 className={styles.subTitle}>59.99/month</h4>
        <div>
            <ul className={styles.list}>
                <li>With ads</li>
                <li>Great Video Quality</li>
                <li>2 Devices</li>
                <li>No Dolby Atmos</li>
            </ul>
            <div className={styles.saveContainer}> 
            <PlayNowButton title="Save 16%" />
            </div>
            <PlayNowButton title="Get Free Trial" />
        </div>
      </div>
      <div className={styles.popup}>
        <h4 className={styles.title}>Standard</h4>
        <h4 className={styles.subTitle}>129.99/month</h4>
        <div>
            <ul className={styles.list}>
                <li>Ad-free</li>
                <li>Great Video Quality</li>
                <li>4 Devices</li>
                <li>No Dolby Atmos</li>
            </ul>
            <div className={styles.saveContainer}> 
            <PlayNowButton title="Save 16%" />
            </div>
            <PlayNowButton title="Get Free Trial" />

        </div>
      </div>
      <div className={styles.popup}>
        <h4 className={styles.title}>Premium</h4>
        <h4 className={styles.subTitle}>189.99/month</h4>
        <div>
            <ul className={styles.list}>
                <li>Ad-free</li>
                <li>Best Video Quality</li>
                <li>4 Devices</li>
                <li>Dolby Atmos Support</li>
            </ul>
            <div className={styles.saveContainer}> 
            <PlayNowButton title="Save 16%" />
            </div>
            <PlayNowButton title="Get Free Trial" />

        </div>
      </div>
      </div>
    </main>
  );
}
