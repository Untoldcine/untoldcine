'use client'

import UntoldLogo from "../../assets/UntoldLogoHeader.svg"
import React, { useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";
import PlayNowButton from "@/components/PlayNow/PlayNow";
import PlanToggle from "@/components/plan-toggle/plan-toggle"
import { SecondaryButton } from "@/components/SecondaryButton/SecondaryButton";
const planDetails = {
  monthly: [ 
    { title: "Basic", price: "5.99", features: ["With ads", "Great Video Quality", "2 Devices", "No Dolby Atmos"] },
    { title: "Standard", price: "12.99", features: ["Ad-free", "Great Video Quality", "4 Devices", "No Dolby Atmos"] },
    { title: "Premium", price: "18.99", features: ["Ad-free", "Best Video Quality", "4 Devices", "Dolby Atmos Support"] }
  ],
  annual: [
    { title: "Basic", price: "59.99", features: ["With ads", "Great Video Quality", "2 Devices", "No Dolby Atmos"] },
    { title: "Standard", price: "129.99", features: ["Ad-free", "Great Video Quality", "4 Devices", "No Dolby Atmos"] },
    { title: "Premium", price: "189.99", features: ["Ad-free", "Best Video Quality", "4 Devices", "Dolby Atmos Support"] }
  ]
};

export default function Home() {
  const [isAnnual, setIsAnnual] = useState(false);
  const currentPlans = isAnnual ? planDetails.annual : planDetails.monthly;
  console.log('Current plans:', currentPlans)
  return (
    <main>
      <nav className={styles.navContainer}>
      <Image src={UntoldLogo} alt="Logo" width={140} height={82} />
      <div className={styles.logoContainer}>
      <Link href="/sign-in" passHref>
            <PrimaryButton className={styles.customPrimaryButton}>Login</PrimaryButton>
          </Link>
        <Link href="/sign-up" passHref>
            <SecondaryButton className={styles.customSecondaryButton}>Sign Up</SecondaryButton>
          </Link>

      </div>
      </nav>
      <div className={styles.titleContainer}> 
        <h2 className={styles.Title}>Choose Your Plan</h2>
        <p className={styles.HerosubTitle}>Watch all you want. Recommendations just for you. Change or cancel your plan anytime.</p>
      </div>
      <div className={styles.toggleContainer}>
        <button className={!isAnnual ? styles.active : styles.inactive} onClick={() => setIsAnnual(false)}>Monthly</button>
        <PlanToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        <button className={isAnnual ? styles.active : styles.inactive} onClick={() => setIsAnnual(true)}>Annually</button>
      </div>
      <div className={styles.main}> 
        {currentPlans.map((plan, index) => (
          <div key={index} className={styles.popup}>
            <h4 className={styles.title}>{plan.title}</h4>
            <h4 className={styles.subTitle}>{plan.price}/month</h4>
            <div>
              <ul className={styles.list}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              {isAnnual && <div className={styles.saveContainer}><PlayNowButton title="Save 16%" onClick = {console.log('hello')}/></div>}
              <PlayNowButton title="Get Free Trial" onClick = {console.log('hello')} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
