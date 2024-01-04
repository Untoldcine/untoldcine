'use client'
import axios from 'axios'
// import { useState, useEffect } from 'react'

const Page = () => {
    const getUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/user')
            console.log(res.data);
        }
        catch (err) {
            console.error(`Error retrieving all user data: ${err}`);
        }

    }


    return (
        <>
            <div>This page is for API testing</div>
            <button onClick={() => getUsers()}>Get all users</button>
        </>
    )
}

export default Page