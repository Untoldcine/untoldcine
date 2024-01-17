"use client";
import styles from "./page.module.css";
import React, { useState } from 'react';
import Link from "next/link";
import { SecondaryButton } from "@/components/SecondaryButton/SecondaryButton.js";
import { ToggleSwitch } from "@/components/ToggleSwitch/ToggleSwitch.js";
import { Popup } from "@/components/Popup/Popup.js";

export function Plans() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <>
            <h1>Choose your plan</h1>
            <p>
                Watch all you want. Recommendations just for you
                <br />
                just for you. Change or cancel your plan anytime
            </p>
            <div>
                <ToggleSwitch off="Monthly" on="Annually" state={isYearly} setState={setIsYearly} />
            </div>
            <div className={styles.grid}>
                <Popup width={382} height={550} className={styles.popup}>
                    <h4>Basic</h4>
                    {!isYearly ? (<h3>5.99/month</h3>) : (<h3>59.99/year</h3>)}
                    <ul>
                        <li>With Ads</li>
                        <li>Great Video Quality</li>
                        <li>2 devices</li>
                        <li>No Dolby Atmos</li>
                    </ul>
                    <SecondaryButton className={styles.button}>
                        Get Free Trial
                    </SecondaryButton>
                </Popup>
                <Popup width={382} height={550} className={styles.popup}>
                    <h4>Standard</h4>
                    {!isYearly ? (<h3>12.99/month</h3>) : (<h3>129.99/year</h3>)}
                    <ul>
                        <li>Ad-free</li>
                        <li>Great Video Quality</li>
                        <li>4 devices</li>
                        <li>No Dolby Atmos</li>
                    </ul>
                    {isYearly ? (<SecondaryButton className={styles.saveLabel}>Save 16%</SecondaryButton>) : (null)}
                    <SecondaryButton className={styles.button}>
                        Get Free Trial
                    </SecondaryButton>
                </Popup>
                <Popup width={382} height={550} className={styles.popup}>
                    <h4>Premium</h4>
                    {!isYearly ? (<h3>18.99/month</h3>) : (<h3>189.99/year</h3>)}
                    <ul>
                        <li>Ad-free</li>
                        <li>Best Video Quality</li>
                        <li>4 devices</li>
                        <li>Dolby Atmos Support</li>
                    </ul>
                    <SecondaryButton className={styles.button}>
                        Get Free Trial
                    </SecondaryButton>
                </Popup>
            </div>
        </>
    );
}
