'use client'
import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";

export default function Home() {

  const [emailValue, setEmailValue] = useState<string>('')
  const [sentRequest, setSentRequest] = useState<boolean>(false)

  const handlePasswordResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSentRequest(true)

  }

  return (
    <main className={styles.main}>
      {sentRequest ?
        <div className={styles.popup}>
          <div className={styles.title}>
            <p>If the email is registered with us, you will receive a link to reset your password.</p>
          </div>
        </div>
        : 
        <form className={styles.popup} onSubmit={(e) => handlePasswordResetEmail(e)}>
          <div className={styles.title}>
            <h4>Forgot Password?</h4>
            <p>Your password will be reset by email</p>
          </div>
          <input className="box" placeholder="Email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
          <div className={styles.primaryButton}> 
          <PrimaryButton>Get a Link</PrimaryButton>
          </div>
          <p className={styles.remember}>
            You remember your password? <Link href="/sign-in">Sign In</Link>
          </p>
        </form>}
    </main> 
  );
}
