'use client'
import axios from 'axios'
import './tempstyles.css'
import { useState, useEffect} from 'react'
import Card from "./card"

const Page = () => {

    const [removeUserID, setRemoveUserID] = useState('')
    const [seriesData, setSeriesData] = useState([])

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

    //when user enters Untold, get sent JSON data that is cached on client side of superficial series information to reduce calls to DB
    //Likely use IndexedDB API for client side caching
    const sendSeriesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/series/summary`)
            const {results} = res.data
            setSeriesData(results)            
        }
        catch (err) {
            console.error(`Error attempting to retrieve series data: ${err}`);
        }
    }


    return (
        <>
            <div className='container'>This page is for API testing
            <button className ="inputs"onClick={() => triggerDeleteUser()}>Remove a user at this id</button>
            <button className ="inputs"onClick={() => createStaticUser()}>Create a new user</button>
            <input value = {removeUserID} onChange = {(e) => handleUserIDChange(e)} className = "inputs"></input>
            <button className ="inputs"onClick={() => sendSeriesData()}>Get series data</button>
            </div>
            <div className='container'>
                {seriesData.length > 0 && seriesData.map((show) => {
                    return <Card content = {show}/>
                })}
            </div>
        </>
    )
}

export default Page