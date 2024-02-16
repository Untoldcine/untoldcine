'use client'
import React, {useState} from "react"
import styles from "./page.module.css";
import Link from "next/link";
import { TextField } from "@/components/TextField/TextField.js";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";
import axios from "axios";

//NEED TO ADD:
//validation for email format
//UI for signalling where errors occur
export default function Home() {

  const [inputFields, setInputFields] = useState({username: '', email: '', password: '', checkPass: ''})

  const handleNewUserSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
   try {
    if (!inputFields.username || !inputFields.email || !inputFields.password) {
      return
    }
    if (inputFields.password !== inputFields.checkPass) {
      throw new Error('Passwords do not match!')
    }    
    const res = await axios.post('http://localhost:3001/api/user/new', {
      nickname: inputFields.username.trim(),
      email: inputFields.email.trim(),
      password: inputFields.password.trim()
    })
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
      <form className={styles.popup} onSubmit = {(e) => handleNewUserSubmit(e)}>
        <h4 className={styles.title}>Sign up</h4>
        <TextField text="User Name" icon="fa fa-user icon" value = {inputFields.username} update = {setInputFields} field = 'username'/>
        <TextField text="Email" icon="fa fa-envelope icon" value = {inputFields.email} update = {setInputFields} field = 'email'/>
        <TextField text="Password" icon="fa fa-lock icon" value = {inputFields.password} update = {setInputFields} field = 'password'/>
        <TextField text="Confirm Password" icon="fa fa-lock icon" value = {inputFields.checkPass} update = {setInputFields} field = 'checkPass'/>
        <div>
          <div className={styles.container}>
            <span className={styles.checkmark}></span>
            <input type="checkbox" className={styles.checkbox} />
            <p>Remember Me</p>
          </div>
        </div>
        <div className={styles.buttonContainer}> 
        <PrimaryButton>Create an Account</PrimaryButton>
        </div>
        

        <p className={styles.remember}>
          Already have an account with us? <Link href="/sign-in">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
