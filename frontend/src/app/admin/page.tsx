'use client'
import { useState, useEffect } from 'react'
import { TextField } from '@/components/TextField/TextField'
import "./styles.css";
import { PrimaryButton } from "@/components/PrimaryButton/PrimaryButton.js";

import axios from 'axios';
import Master from './Master';


const Admin = () => {

  const [adminState, setAdminState] = useState(false)
  const [adminToggle, setAdminToggle] = useState(false)
  const [inputFields, setInputFields] = useState({ email: '', password: '' })
  const [allContentData, setAllContentData] = useState([])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!inputFields.email || !inputFields.password) {
        return
      }
      const res = await axios.post('http://localhost:3001/api/user/adminLogin', {
        email: inputFields.email.trim(),
        password: inputFields.password.trim()
      })
      if (res.status === 200) {
        setAdminToggle(true)
        sessionStorage.setItem('adminAccess', 'true')
        

      }
    }
    catch (err: any) {
      if (err.response) {
        console.error(err.response.data.message);
      }
      console.error(err + ': Error attempting to log in');
    }
  }

  const retrieveAll = async () => {
    const data = await axios.get('http://localhost:3001/api/user/adminGetAll')
    setAllContentData(data.data)
    
  }

  useEffect(() => {
    if (sessionStorage.getItem('adminAccess')) {
      setAdminState(true)
      retrieveAll()
    }
  }, [adminToggle])


  if (adminState) {
    return <Master content = {allContentData}/>
  }

  else {
    return (
      <main className="main">
        <form className="popup" onSubmit={(e) => handleSignIn(e)}>
          <h4 className="title">Admin Sign In</h4>
          <div className="textfieldContainer">
            <TextField text="Admin User" value={inputFields.email} update={setInputFields} icon="fa fa-user icon" field='email' />
            <TextField text="Admin Password" value={inputFields.password} update={setInputFields} icon="fa fa-lock icon" field='password' />
          </div>
          <div>
          </div>
          <div className="buttonContainer">
            <PrimaryButton className="primary">Sign In</PrimaryButton>
          </div>
        </form>
        {/* <button onClick = {() => testGet()}>Click</button> */}
      </main>
    )
  }
}

export default Admin