'use client'
import axios from 'axios'
import './tempstyles.css'
import { useState} from 'react'
import Card from "./card"
import Podcasts from "./podcasts"

interface Show {
    ID: number,
    series_type: string,
    series_name: string,
    length: number | null,
    rating: string,
    genres: string
}

interface Podcast {
    ID: number,
    name: string,
    media_type: string,
}

const Page = () => {

    const [removeUserID, setRemoveUserID] = useState('')
    const [seriesData, setSeriesData] = useState<Show[]|[]>([])
    const [podcastData, setPodcastData] = useState<Podcast[]|[]>([])

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
        if (!removeUserID) {
            return
        }
        try {
            const res = await axios.post(`http://localhost:3001/api/user/delete/${removeUserID}`)
            console.log(res.data);
            
        }
        catch (err) {
            console.error(`Error attempting to delete user at id ${removeUserID}: ${err}`);
            
        }
    }

    //when user enters Untold, get sent JSON data that is cached on client side of superficial series information to reduce calls to DB
    //Likely use IndexedDB API for client side caching
    const getSeriesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/series/summary`)
            const {results} = res.data
            setSeriesData(results)                        
        }
        catch (err) {
            console.error(`Error attempting to retrieve series data: ${err}`);
        }
    }

    const getPodcastData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/podcast/summary`)
            const {results} = res.data            
            setPodcastData(results)                        
        }
        catch (err) {
            console.error(`Error attempting to retrieve podcast data: ${err}`);
        }
    }

    return (
        <>
            <div className='container'>This page is for API testing
            <button className ="inputs"onClick={() => triggerDeleteUser()}>Remove a user at this id</button>
            <button className ="inputs"onClick={() => createStaticUser()}>Create a new user</button>
            <input value = {removeUserID} onChange = {(e) => handleUserIDChange(e)} className = "inputs"></input>
            <button className ="inputs"onClick={() => getPodcastData()}>Get podcast data</button>
            <button className ="inputs"onClick={() => getSeriesData()}>Get series data</button>
            </div>
            <div className='container'>
                {seriesData.length > 0 && seriesData.map((show) => {
                    return <Card key = {show.ID} content = {show}/>
                })}
            </div>
            <div className='container'>     
                {podcastData.length > 0 && podcastData.map((podcast) => {
                    return <Podcasts key = {podcast.ID} content = {podcast}/>
                })}
            </div>
        </>
    )
}

export default Page