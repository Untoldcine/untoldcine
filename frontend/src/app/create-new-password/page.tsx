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
            <p className={styles.title}>Create New Password</p>
            <p className={styles.subTitle}>Create new password for your account.</p>
        </div>
        <TextField text="Password" icon="fa fa-lock icon" />
        <TextField text="Confirm New Password" icon="fa fa-lock icon" />

        <div>
        </div>
        <PrimaryButton className={styles.primary}>Reset password</PrimaryButton>
      </div>
      <div className={styles.test}>
     


      </div>
    </main> 
  );
}
