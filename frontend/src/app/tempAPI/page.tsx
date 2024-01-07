'use client'
import axios from 'axios'
import { useState, useEffect, ReactEventHandler} from 'react'

const Page = () => {

    const [removeUserID, setRemoveUserID] = useState('')

    const handleUserIDChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setRemoveUserID(e.target.value)        
    }

    const createStaticUser = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/user/new', {
                nickname: 'Test',
                email: 'test@hotmail.com',
                password: '12345',
                sub_level: 1
            })
            console.log(res.data);
            
        }
        catch (err) {
            console.error(`Error attempting to create new user: ${err}`);
            
        }
    }

    const triggerDeleteUser = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/api/user/delete/${removeUserID}`)
        }
        catch (err) {
            console.error(`Error attempting to delete user at id ${removeUserID}: ${err}`);
            
        }
    }


    return (
        <>
            <div>This page is for API testing
            <button onClick={() => createStaticUser()}>Create a new user</button>
            <button onClick={() => triggerDeleteUser()}>Remove a user at this id</button>
            <input value = {removeUserID} onChange = {(e) => handleUserIDChange(e)}></input>
            </div>
        </>
    )
}

export default Page