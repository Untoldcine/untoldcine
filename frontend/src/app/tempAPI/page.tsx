'use client'
import axios from 'axios'
import './tempstyles.css'
import { useState, useEffect } from 'react'
import Card from "./card"
import Podcasts from "./podcasts"
import CommentComponent from './comment'
import Login from './login'
import styles from "../page.module.css"
import { Footer } from '@/components/Footer/Footer'
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn'
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn'


interface SeriesSummary {
    series_id: number
    series_name: string
    series_status: string
    genres: string[]
    series_thumbnail: string | null
    series_length: number
  }

  interface MovieSummary {
    movie_id: number
    movie_name: string
    movie_status: string
    genres: string[]
    movie_length: number
    movie_thumbnail: string | null
  }

  interface PodcastSummary {
    podcast_id: number
    podcast_name: string
    podcast_status: string
    podcast_thumbnail: string | null
  }

  interface BTSSeriesSummary {
    series_id: number
    bts_series_id: number
    series_name: string
    series_status: string
    series_thumbnail: string | null
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
    const [seriesData, setSeriesData] = useState<SeriesSummary[] | []>([])
    const [moviesData, setMoviesData] = useState<MovieSummary[] | []>([])
    const [podcastData, setPodcastData] = useState<PodcastSummary[] | []>([])
    const [btsSeriesData, setBtsSeriesData] = useState<BTSSeriesSummary[] | []>([])
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
            const res = await axios.get(`http://localhost:3001/api/series/seriesSummary`)
            console.log(res.data);
            setSeriesData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve series data: ${err}`);
        }
    }

    const getMoviesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/series/movieSummary`)
            console.log(res.data);
            setMoviesData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve series data: ${err}`);
        }
    }

    const getPodcastData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/podcast/podcastSummary`)
            console.log(res.data);
            setPodcastData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve podcast data: ${err}`);
        }
    }

    //all bts content should be in their own components but i got lazy for testing
    const getBTSSeriesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/bts/summaryBTSSeries`)
            console.log(res.data);
            setBtsSeriesData(res.data)
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
                <button className="inputs" onClick={() => getPodcastData()}>Get podcast data</button>
                <button className="inputs" onClick={() => getSeriesData()}>Get series data</button>
                <button className="inputs" onClick={() => getMoviesData()}>Get movies data</button>
                <button className="inputs" onClick={() => getBTSSeriesData()}>Get BTS Series data</button>
                {/* <button className="inputs" onClick={() => getBTSData()}>Get BTS Movies data</button> */}
            </div>
            <div className='container'>
                {seriesData.length > 0 && seriesData.map((video) => {
                    return <Card key={video.series_id} content={video} />
                })}
            </div>
            <div className='container'>
                {moviesData.length > 0 && moviesData.map((movie) => {
                    return <Card key={movie.movie_id} content={movie} />
                })}
            </div>
            <div className='container'>
                {podcastData.length > 0 && podcastData.map((podcast) => {
                    return <Card key={podcast.podcast_id} content={podcast} />
                })}
            </div>
            <div className='container'>
                {btsSeriesData.length > 0 && btsSeriesData.map((btsSeries) => {
                    return <Card key={btsSeries.bts_series_id} content={btsSeries} />
                })}
            </div>
            {/* <div className='container'>
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
                <div>

                <Footer />
                </div>
            </div> */}
        </>
    )
}

export default Page