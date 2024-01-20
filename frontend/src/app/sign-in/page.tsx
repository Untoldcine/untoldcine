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
        <h4 className={styles.title}>Sign In</h4>
        <TextField text="User Name" icon="fa fa-user icon" />
        <TextField text="Password" icon="fa fa-lock icon" />
        <div>
          <div className={styles.container}>
            <span className={styles.checkmark}></span>
            <input type="checkbox" className={styles.checkbox} />
            <p>Remember Me</p>
            <p>
              <Link href="forgot-password">Forgot password</Link>
            </p>
          </div>
        </div>
        <PrimaryButton>Sign In</PrimaryButton>
        <p className={styles.remember}>
          Don't have any account? <Link href="/">Sign up</Link>
        </p>
      </div>
      <div className={styles.test}>
      <Footer />


      </div>
    </main> 
  );
}
