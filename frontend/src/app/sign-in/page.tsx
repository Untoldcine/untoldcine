'use client'
import {useState} from "react"
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";

export default function Home() {

  const [inputFields, setInputFields] = useState({email: '', password: ''})



  return (
    <main className={styles.main}>
      <div className={styles.popup}>
        <h4 className={styles.title}>Sign In</h4>
        <TextField text="Email" value = {inputFields.email} update = {setInputFields} icon="fa fa-user icon" field = 'email'/>
        <TextField text="Password" value = {inputFields.password} update = {setInputFields} icon="fa fa-lock icon" field = 'password'/>
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
    </main>
  );
}
