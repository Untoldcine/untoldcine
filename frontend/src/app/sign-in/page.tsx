'use client'
import { useState } from "react"
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";
import { SocialBar } from "@/components/SocialIconBar/SocialIconBar"; 
import { FooterLogo } from "@/components/FooterLogo/FooterLogo"; 
import { Footer } from "@/components/Footer/Footer";
import axios from "axios";

export default function Home() {

  const [inputFields, setInputFields] = useState({ email: '', password: '' })

  //NEED TO ADD: 'Remember Me' functionality which uses Persistent Cookies to keep users logged in for longer periods of time
  //If user is already logged in, retrieve their info once again
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!inputFields.email || !inputFields.password) {
        return
      }
      const res = await axios.post('http://localhost:3001/api/user/login', {
        email: inputFields.email.trim(),
        password: inputFields.password.trim()
      }, { withCredentials: true })
      if (res.status === 200) {
        //Browser will receive cookie for authorization, handles submission automatically on subsequent API calls
       console.log('works!');
       
      }
    }
    catch (err:any) {
      if (err.response) {
        console.error(err.response.data.message); 
      }
      console.error(err + ': Error attempting to log in');
    }
  }

  return (
    <main className={styles.main}>
      <form className={styles.popup} onSubmit={(e) => handleSignIn(e)}>
        <h4 className={styles.title}>Sign In</h4>
        <TextField text="Email" value={inputFields.email} update={setInputFields} icon="fa fa-user icon" field='email' />
        <TextField text="Password" value={inputFields.password} update={setInputFields} icon="fa fa-lock icon" field='password' />
        <div>
          <div className={styles.container}>
            <span className={styles.checkmark}></span>
            <input type="checkbox" className={styles.checkbox} />
            <p>Remember Me</p>
            <p>
              <Link className={styles.forgot} href="forgot-password">Forgot password?</Link>
            </p>
          </div>

        </div>
        <div className={styles.buttonContainer}>
          <PrimaryButton className={styles.primary}>Sign In</PrimaryButton>
        </div>
        <p className={styles.remember}>
          Don't have any account? <Link href="/">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
