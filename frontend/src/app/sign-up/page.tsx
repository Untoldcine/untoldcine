'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.popup}>
        <h4 className={styles.title}>Sign up</h4>
        <TextField text="User Name" icon="fa fa-user icon" />
        <TextField text="Email" icon="fa fa-envelope icon" />
        <TextField text="Password" icon="fa fa-lock icon" />
        <TextField text="Confirm Password" icon="fa fa-lock icon" />
        <div>
          <div className={styles.container}>
            <span className={styles.checkmark}></span>
            <input type="checkbox" className={styles.checkbox} />
            <p>Remember Me</p>
          </div>
        </div>
        <div className={styles.buttonContainer}> 
        <PrimaryButton className={styles.primaryButton}>Create an Account</PrimaryButton>
        </div>
        <p className={styles.remember}>
          Already have an account with us? <Link className={styles.signInLink} href="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
