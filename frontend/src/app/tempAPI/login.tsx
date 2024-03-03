'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface User {
    ID: number,
    nickname: string,
    password: string,
    email: string,
    sub_level: number,
    free_tier: boolean,
    billing_history: null,
    next_bill: string,
    created_at: string,
    deleted: boolean | null,
    deleted_at: string | null,
}

interface LoginInputs {
    email: string
    password: string
}

const Login = () => {

    const [inputFields, setInputFields] = useState<LoginInputs>({email: '', password: ''})
    const [loginStatus, setLoginStatus] = useState<Boolean>(false)
    const [userData, setUserData] = useState<User>()
    const [parsedSubLevel, setParsedSubLevel] = useState<string>('Unregistered')

    useEffect(() => {
        if (userData?.sub_level === 0) {
            setParsedSubLevel('Unregistered')
        }
        if (userData?.sub_level === 1) {
            setParsedSubLevel('Free Tier')

        }
        if (userData?.sub_level === 2) {
            setParsedSubLevel('Basic')

        }
        if (userData?.sub_level === 3) {
            setParsedSubLevel('Standard')

        }
        if (userData?.sub_level === 4) {
            setParsedSubLevel('Premium')

        }
    }, [userData])

    //Hard coded credentials but will switch out to stateful inputs in actual implementation
    const toggleLogIn = async () => {        
        try {
            // const res = await axios.post('http://localhost:3001/api/user/login', {
            //     email: inputFields.email,
            //     password: inputFields.password
            // })
            const res = await axios.post('/api/users/login', {
                email: inputFields.email,
                password: inputFields.password
            })
            if (res.status === 200) {
                setLoginStatus(true)
                setUserData(res.data[0])
                sessionStorage.setItem('userID', res.data[0].ID)
            }
        }
        catch (err) {
            console.error('Error attempting to log in: ' + err);

        }
    }

    return (
        <div className='block'>
        <h2>Login Block</h2>
        <p>Email</p>
        <input name = 'email' value = {inputFields.email} onChange = {(e) => setInputFields(prev => ({...prev, email: e.target.value}))}/>
        <p>Password</p>
        <input name = 'password' value = {inputFields.password} onChange = {(e) => setInputFields(prev => ({...prev, password: e.target.value}))}/>    
        <br/>    
        <button onClick={() => toggleLogIn()}>Log in</button>
            {userData ?
                <>
                    <p>Logged in!</p>
                    {!userData.free_tier ? <p>{userData.nickname} is eligible for a free trial!</p> : null}
                    {!userData.free_tier ? <button disabled>Activate Free Trial</button> : null}
                    <p>Current sub-level: {parsedSubLevel}</p>
                    <p>User ID has been set to {userData.ID}</p>
                </>
                : null}
                <br/>
        <button onClick = {() => sessionStorage.removeItem('userID')}>Log out</button>
        </div>
    )
}

export default Login