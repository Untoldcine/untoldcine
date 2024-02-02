'use client'
import axios from 'axios'
import './tempstyles.css'
import { useState, useEffect } from 'react'
import Card from "./card"
import Podcasts from "./podcasts"
import CommentComponent from './comment'
import Login from './login'

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

interface BTS {
    ID: number,
    series_name: string
}

interface Comment {
    ID: number,
    content: string,
    date: string,
    parent_id: number | null,
    series_id: number | null,
    nickname: string,
    user_id: number,
    rating: string,
    replies: Comment[] | [],
    podcast_id: number | null,
    btsflag: boolean | null
    edited: boolean
    user_feedback: string | null

}

interface DBCommentObj {
    topLevel: Comment[] | null,
    allComments: Comment[] | null
}

const Page = () => {

    const [removeUserID, setRemoveUserID] = useState('')
    const [seriesData, setSeriesData] = useState<Show[] | []>([])
    const [podcastData, setPodcastData] = useState<Podcast[] | []>([])
    const [preProdType, setPreProdType] = useState<any>()
    const [prodType, setProdType] = useState<any>()
    const [postProdType, setPostProdType] = useState<any>()
    const [newCommentValue, setNewCommentValue] = useState<string>('')
    const [btsComments, setBTSComments] = useState<DBCommentObj | null>(null)

    const userID = 17; 

    const handleUserIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRemoveUserID(e.target.value)
    }

    const createStaticUser = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/user/new', {
                nickname: 'Tester',
                email: 'tester@hotmail.com',
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
            console.log(res.data);
            
            // const { results } = res.data
            // setSeriesData(results)
        }
        catch (err) {
            console.error(`Error attempting to retrieve series data: ${err}`);
        }
    }

    const getPodcastData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/podcast/summary`)
            const { results } = res.data
            setPodcastData(results)
        }
        catch (err) {
            console.error(`Error attempting to retrieve podcast data: ${err}`);
        }
    }

    //all bts content should be in their own components but i got lazy for testing
    const getBTSData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/bts/summaryBTS`)
            const { pre, prod, post } = res.data
            setPreProdType(pre)
            setProdType(prod)
            setPostProdType(post)
        }
        catch (err) {
            console.error(`Error attempting to retrieve podcast data: ${err}`);
        }
    }

    const getSpecificBTS = async (ID: number) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/bts/specificBTS/${userID}/${ID}`)
            console.log(res.data);
        }
        catch (err) {
            console.error(`Error attempting to retrieve specific BTS data: ${err}`);
        }
    }

    const postNewComment = async (e:React.FormEvent, btsID: number) => {
        e.preventDefault()
        const commentObj = {
            content: newCommentValue,
            ID: btsID,
            table_name: 'bts_comments'
        }
        try {
            const res = await axios.post(`http://localhost:3001/api/comments/newComment/${userID}`, commentObj)  
            if (res.status === 200) {
                setNewCommentValue('')
            }
            
        }
        catch (err) {
            console.error(`Error attempting to POST new comment data: ${err}`);
        }
    }

    const addToWatchList = async (ID: number) => {
        axios.post('http://localhost:3001/api/watchlist/add', {
            user_id: 2,
            content_type: 'BTS',
            content_id: ID
        })
            .then((res) => {
                if (res.data === 'OK') {
                    console.log('added to watchlist successfully');

                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const getBTSComments = async (ID: number) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/comments/getBTSDiscussion/${userID}/${ID}`)                        
            setBTSComments(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve comments data: ${err}`);
        }
    }

    return (
        <>
            <div className='container' style = {{color: 'white'}}>This page is for API testing
                {/* <Login /> */}
                {/* <button className="inputs" onClick={() => createStaticUser()}>Create a new user</button> */}
                {/* <button className="inputs" onClick={() => triggerDeleteUser()}>Remove a user at this id</button> */}
                {/* <input value={removeUserID} onChange={(e) => handleUserIDChange(e)} className="inputs"></input> */}
                <button className="inputs" onClick={() => getPodcastData()}>Get podcast data</button>
                <button className="inputs" onClick={() => getSeriesData()}>Get series data</button>
                <button className="inputs" onClick={() => getBTSData()}>Get BTS data</button>
            </div>
            <div className='container'>
                {seriesData.length > 0 && seriesData.map((show) => {
                    return <Card key={show.ID} content={show} />
                })}
            </div>
            <div className='container'>
                {podcastData.length > 0 && podcastData.map((podcast) => {
                    return <Podcasts key={podcast.ID} content={podcast} />
                })}
            </div>
            <div className='container'>
                <h4>Pre-production</h4>
                {preProdType ? preProdType.map((content: BTS) => {
                    return <div key={content.ID} className="video-block">
                        <p>{content.series_name}</p>
                        <button onClick={() => getSpecificBTS(content.ID)}>See More (get all related bts videos)</button>
                        <br />
                        <button disabled onClick={() => addToWatchList(content.ID)}>Add to Watchlist</button>
                        <br/>
                        <button onClick={() => getBTSComments(content.ID)}>Open Discussions for this BTS series</button>
                        <form className='block' onSubmit={(e) => postNewComment(e, content.ID)}>
                            <input value={newCommentValue} onChange={(e) => setNewCommentValue(e.target.value)}></input>
                            <button>Submit Comment</button>
                        </form>
                        {btsComments ? <div className = "block">
                            {btsComments.topLevel?.map((comment) => {
                                return <CommentComponent key = {comment.ID} post = {comment}/>

                            })}
                        </div> : null}
                    </div>
                }) : null}
                <h4>Production</h4>
                {prodType ? prodType.map((content: BTS) => {
                    return <div key={content.ID} className="video-block">
                        <p>{content.series_name}</p>
                        <button onClick={() => getSpecificBTS(content.ID)}>See More (get all related bts videos)</button>
                        <br />
                        <button disabled onClick={() => addToWatchList(content.ID)}>Add to Watchlist</button>
                    </div>
                }) : null}
                <h4>Post-production</h4>
                {postProdType ? postProdType.map((content: BTS) => {
                    return <div key={content.ID} className="video-block">
                        <p>{content.series_name}</p>
                        <button onClick={() => getSpecificBTS(content.ID)}>See More (get all related bts videos)</button>
                        <br />
                        <button disabled onClick={() => addToWatchList(content.ID)}>Add to Watchlist</button>
                    </div>
                }) : null}
            </div>
        </>
    )
}

export default Page