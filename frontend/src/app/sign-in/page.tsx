'use client'
import { useState } from "react"
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import axios from "axios";
import Logo from "@/assets/UntoldLogoHeader.svg"
import { useRouter } from 'next/navigation';



export default function Home() {
  const [inputFields, setInputFields] = useState({ email: '', password: '' })
  const router = useRouter();
  
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

        setItemWithExpiry('untoldcine-loggedin', 'true', 24 * 60 * 60 * 1000); // TTL is 24 hours
        router.push('/home');
      }
    }
    catch (err:any) {
      if (err.response) {
        console.error(err.response.data.message); 
      }
      console.error(err + ': Error attempting to log in');
    }
  }

  const setItemWithExpiry = (key: string, value: string, ttl: number) => {
    const now = new Date();

    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};
 
  return (
    <main className={styles.main}>
      <Link href = "/home" className={styles.top_logo}><img src = {Logo.src} ></img></Link>
      <form className={styles.popup} onSubmit={(e) => handleSignIn(e)}>
        <h4 className={styles.title}>Sign In</h4>
        <div className={styles.textfieldContainer}> 
        <TextField text="Email" value={inputFields.email} update={setInputFields} icon="fa fa-user icon" field='email' />
        <TextField text="Password" value={inputFields.password} update={setInputFields} icon="fa fa-lock icon" field='password' />
        </div>
        {/* <div>
          <div className={styles.container}>
            <span className={styles.checkmark}></span>
            <div className={styles.checkboxContainer}> 
            <input type="checkbox" className={styles.checkbox} />
            <p>Remember Me</p>
            </div>
            <p className={styles.forgot}>
              <Link className={styles.forgot} href="forgot-password">Forgot password?</Link>
            </p>
          </div>

        </div> */}
        <div className={styles.buttonContainer}>
        <button className={styles.primaryButton} type = "submit">Create an Account</button>
        </div>
        <p className={styles.remember}>
        Already have an account with us? <Link className={styles.signInLink} href="/sign-up">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
