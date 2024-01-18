import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.popup}>
        <div className={styles.title}>
          <h4>Forgot Password?</h4>
          <p>Your password will be reset by email</p>
        </div>
        <TextField text="Email" icon="fa fa-envelope icon" />
        <PrimaryButton>Get a Link</PrimaryButton>
        <p className={styles.remember}>
          You remember your password? <Link href="/sign-in">Sign In</Link>
        </p>
      </div>
    </main>
  );
}
