'use client'
import {useState} from "react"
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";

export default function Home() {

  const [inputFields, setInputFields] = useState({username: '', email: '', password: ''})

  return (
    <main className={styles.main}>
      <div className={styles.popup}>
        <h4 className={styles.title}>Sign up</h4>
        <TextField text="User Name" icon="fa fa-user icon" value = {inputFields.username} update = {setInputFields} field = 'username'/>
        <TextField text="Email" icon="fa fa-envelope icon" value = {inputFields.email} update = {setInputFields} field = 'email'/>
        <TextField text="Password" icon="fa fa-lock icon" value = {inputFields.password} update = {setInputFields} field = 'password'/>
        {/* <TextField text="Confirm Password" icon="fa fa-lock icon" /> */}
        <div>
          <div className={styles.container}>
            <span className={styles.checkmark}></span>
            <input type="checkbox" className={styles.checkbox} />
            <p>Remember Me</p>
          </div>
        </div>
        <PrimaryButton>Create an Account</PrimaryButton>
        <p className={styles.remember}>
          Already have an account with us? <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
