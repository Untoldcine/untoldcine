import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";
import { SocialBar } from "@/components/SocialIconBar/SocialIconBar"; 
import { FooterLogo } from "@/components/FooterLogo/FooterLogo"; 
import { Footer } from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.popup}>
        <div> 
            <p className={styles.title}>Confirm Your Account</p>
            <p className={styles.subTitle}>We've sent a code to your email.</p>
        </div>
        <TextField text="Enter Code Here" icon="" />
        <div>
        </div>
        <PrimaryButton className={styles.primary}>Confirm Account</PrimaryButton>
        <p className={styles.remember}>
          Don't have any account? <Link href="/">Sign up</Link>
        </p>
      </div>
      <div className={styles.test}>
     


      </div>
    </main> 
  );
}
