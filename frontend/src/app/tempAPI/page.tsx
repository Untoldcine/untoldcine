'use client'
import axios from 'axios'
import './tempstyles.css'
import { useState, useEffect } from 'react'
import {SeriesSummary, MovieSummary, PodcastSummary, BTSSeriesSummary, BTSMoviesSummary} from "./interfaces"
import Card from "./card"
import Podcasts from "./podcasts"
import CommentComponent from './comment'
import Login from './login'
import styles from "../page.module.css"
import { Footer } from '@/components/Footer/Footer'
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn'
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn'


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

    const [seriesData, setSeriesData] = useState<SeriesSummary[] | []>([])
    const [moviesData, setMoviesData] = useState<MovieSummary[] | []>([])
    const [podcastData, setPodcastData] = useState<PodcastSummary[] | []>([])
    const [btsSeriesData, setBtsSeriesData] = useState<BTSSeriesSummary[] | []>([])
    const [btsMoviesData, setBtsMoviesData] = useState<BTSMoviesSummary[] | []>([])

    const [newCommentValue, setNewCommentValue] = useState<string>('')
    const [btsComments, setBTSComments] = useState<DBCommentObj | null>(null)


    //when user enters Untold, get sent JSON data that is cached on client side of superficial series information to reduce calls to DB
    //Likely use IndexedDB API for client side caching
    const getSeriesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/series/seriesSummary`, {withCredentials: true})
            // console.log(res.data);
            setSeriesData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve series data: ${err}`);
        }
    }

    const getMoviesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/movies/movieSummary`, {withCredentials: true})
            console.log(res.data);
            setMoviesData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve movie data: ${err}`);
        }
    }

    const getPodcastData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/podcast/podcastSummary`, {withCredentials: true})
            console.log(res.data);
            setPodcastData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve podcast data: ${err}`);
        }
    }

    const getBTSSeriesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/bts/summaryBTSSeries`, {withCredentials: true})
            console.log(res.data);
            setBtsSeriesData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve BTS Series data: ${err}`);
        }
    }

    const getBTSMoviesData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/bts/summaryBTSMovies`, {withCredentials: true})
            console.log(res.data);
            setBtsMoviesData(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve BTS Movies data: ${err}`);
        }
    }

    const getAllBTSSummaryData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/bts/summaryBTSAll`, {withCredentials: true})
            console.log(res.data);
        }
        catch (err) {
            console.error(`Error attempting to retrieve all BTS summaries data: ${err}`);
        }
    }

    // const addToWatchList = async (ID: number) => {
    //     axios.post('http://localhost:3001/api/watchlist/add', {
    //         user_id: 2,
    //         content_type: 'BTS',
    //         content_id: ID
    //     })
    //         .then((res) => {
    //             if (res.data === 'OK') {
    //                 console.log('added to watchlist successfully');

    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }

    return (
        <>
            <div className='container' style = {{color: 'white'}}>This page is for API testing
                <button className="inputs" onClick={() => getSeriesData()}>Get series data</button>
                <button className="inputs" onClick={() => getMoviesData()}>Get movies data</button>
                <button className="inputs" onClick={() => getPodcastData()}>Get podcast data</button>
                <button className="inputs"  onClick={() => getBTSSeriesData()}>Get BTS Series data</button>
                <button className="inputs"  onClick={() => getBTSMoviesData()}>Get BTS Movies data</button>
                <button className="inputs" onClick={() => getAllBTSSummaryData()}>Get All BTS (as it should be in production)</button>
                <p>All BTS content already comes as filtered arrays for pre, prod, and post status</p>
                
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
            <div className='container'>
                {btsMoviesData.length > 0 && btsMoviesData.map((btsMovies) => {
                    return <Card key={btsMovies.bts_movies_id} content={btsMovies} />
                })}
            </div>
        </>
    )
}

export default Page