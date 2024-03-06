'use client';
import React, { useState } from "react"
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import axios from "axios";
import Logo from "@/assets/UntoldLogoHeader.svg"

type InputFields = {
  nickname: string
  email: string
  password: string
}

export default function Home() {

  const [inputFields, setInputFields] = useState<InputFields>({ nickname: '', email: '', password: '' })
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!inputFields.email || !inputFields.password || !inputFields.nickname) {
        return
      }
      if (inputFields.password !== confirmPasswordValue) {
        return
      }
      const res = await axios.post('http://localhost:3001/api/user/new', {
        nickname: inputFields.nickname.trim(),
        email: inputFields.email.trim(),
        password: inputFields.password.trim()
      }, { withCredentials: true })
      if (res.status === 200) {
        console.log('works!');
        
      }
  }
    catch (err:any) {
      if (err.response) {
        console.error(err.response.data.message); 
      }
      console.error(err + ': Error attempting to sign up');
    }
  }

  return (
    <main className={styles.main}>
      <Link href = "/home" className={styles.top_logo}><img src = {Logo.src} ></img></Link>
      <form className={styles.popup} onSubmit={(e) => handleSignUp(e)}>
        <h4 className={styles.title}>Sign Up</h4>
        <TextField update = {setInputFields} value = {inputFields.nickname} text="User Name" icon="fa fa-user icon" field = "username"/>
        <TextField update = {setInputFields} value = {inputFields.email} text="Email" icon="fa fa-envelope icon" field = "email"/>
        <TextField update = {setInputFields} value = {inputFields.password} text="Password" icon="fa fa-lock icon" field = "password"/>
        <div className="box">
        <i className ="fa fa-lock icon" ></i>
          <input value = {confirmPasswordValue} type = 'password' placeholder = "Confirm Password" onChange = {(e) => setConfirmPasswordValue(e.target.value)} className="input"/>
        </div>
        {/* <div className={styles.remember_container}>
            <span className={styles.checkmark}></span>
            <input type="checkbox" className={styles.checkbox} />
            <p>Remember Me</p>
        </div> */}
        <div className={styles.buttonContainer}> 
        <button className={styles.primaryButton} type = "submit">Create an Account</button>
        </div>
        <p className={styles.remember}>
          Already have an account with us? <Link className={styles.signInLink} href="/sign-in">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
