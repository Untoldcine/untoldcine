import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.popup}>
        <div className={styles.title}>
          <h4>Create new Password</h4>
          <p>Create new password for your account</p>
        </div>
        {/* <TextField text="Password" icon="fa fa-lock icon" />
        <TextField text="Confirm New Password" icon="fa fa-lock icon" /> */}
        <PrimaryButton>Reset Password</PrimaryButton>
      </div>
    </main>
  );
}
