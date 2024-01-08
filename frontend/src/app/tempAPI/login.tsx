'use client'
import axios from 'axios'
import { useState } from 'react'

const Login = () => {

    const [loginStatus, setLoginStatus] = useState<Boolean>(false)

    //Hard coded credentials but will switch out to stateful inputs in actual implementation
    const toggleLogIn = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/user/login', {
                email: 'test@hotmail.com',
                password: 12345
            })
            if (res.data === 'OK') {
                setLoginStatus(true)
            }
        }
        catch (err) {
            console.error('Error attempting to log in: ' + err);

        }
    }
    return (
        <div className='block'><p>Login Block</p>
            <button onClick={() => toggleLogIn()}>Log in</button>
            {loginStatus ? <p>Logged in!</p> : null}
        </div>
    )
}

export default Login