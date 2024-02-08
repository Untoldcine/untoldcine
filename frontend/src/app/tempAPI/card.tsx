'use client'
import axios from "axios"
import { useState } from "react"
import {SeriesSummary, MovieSummary, PodcastSummary, BTSSeriesSummary, BTSMoviesSummary} from "./interfaces"
import testImg from "./testimg.jpeg"
import testPod from "./testPodcast.jpeg"
import testMovieImg from "./testmovie.png"
import "./tempstyles.css"
import Comment from "./comments"

type Content = SeriesSummary | MovieSummary | PodcastSummary | BTSSeriesSummary | BTSMoviesSummary;

interface CardProps {
  content: Content;
}


const Card: React.FC<CardProps> = ({ content }) => {

  const [commentArray, setCommentArray] = useState([])

  //type guards
  function isSeries(content: Content): content is SeriesSummary {
    return 'series_id' in content && !('bts_series_id' in content);
  }

  function isMovie(content: Content): content is MovieSummary {
    return 'movie_id' in content && !('bts_movies_id' in content);
  }

  function isPodcast(content: Content): content is PodcastSummary {
    return 'podcast_id' in content;
  }

  function isBTSSeries(content: Content): content is BTSSeriesSummary {
    return 'series_id' in content && 'bts_series_id' in content;
  }

  function isBTSMovies(content: Content): content is BTSMoviesSummary {
    return 'movie_id' in content && 'bts_movies_id' in content;
  }

  const getSpecificContent = async (content: string, id: number) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/${content}/specific/${id}`)
      console.log(res.data);
      
    }
    catch(err) {
      console.error('Error attempting to GET detailed content data');
      
    }
  }

  const getSpecificBTSContent = async (flag: string, content: string, id: number) => {
    try {
      if (flag === 'series') {
        const res = await axios.get(`http://localhost:3001/api/bts/specificSeries/${id}`)
        console.log(res.data);
      }
      if (flag === 'movies') {
        const res = await axios.get(`http://localhost:3001/api/bts/specificMovies/${id}`)
        console.log(res.data);
      }
    }
    catch(err) {
      console.error('Error attempting to GET detailed content data');
      
    }
  }

  const getComments = async (content: string, content_id: number) => {
    const user_id = 19 //my test id
    try {
      const res = await axios.get(`http://localhost:3001/api/${content}/comments/${user_id}/${content_id}`)
      // console.log(res.data);
      setCommentArray(res.data)
      
    }
    catch(err) {
      console.error('Error attempting to GET comments data');
      
    }
  }

  if (isSeries(content)) {
    const { series_id, series_name, series_thumbnail, genres, series_length } = content

    return (
      <>
      <div className="summary-block">
        <img className="summary-img" src={testImg.src} />
        <p>{series_name}</p>
        <p>{series_length} episodes</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
        <button onClick = {() => getSpecificContent('series', series_id)}>Get more info</button>
        <button onClick = {() => getComments('series', series_id)}>Get comments</button>
      </div>
      <Comment array = {commentArray}/>
      </>
    )
  }
  if (isMovie(content)) {    
    const {movie_id, movie_name, movie_thumbnail, genres, movie_length} = content
    return (
      <>
      <div className="summary-block">
        <img className="summary-img" src={testMovieImg.src} />
        <p>{movie_name}</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
        <button onClick = {() => getSpecificContent('movies', movie_id)}>Get more info</button>
        <button onClick = {() => getComments('movies', movie_id)}>Get comments</button>
      </div>
            <Comment array = {commentArray}/>
      </>
    )
  }
  if (isPodcast(content)) {
    const {podcast_id, podcast_name, podcast_thumbnail, podcast_status} = content
    return (
      <>
      <div className="summary-block">
        <img className="summary-img" src={testPod.src} />
        <p>{podcast_name}</p>
        <button onClick = {() => getSpecificContent('podcast', podcast_id)}>Get more info</button>
        <button onClick = {() => getComments('podcast', podcast_id)}>Get comments</button>
      </div>
      <Comment array = {commentArray}/>
      </>
    )
  }
  if (isBTSSeries(content)) {    
    const { bts_series_id, series_id, series_name, series_thumbnail, series_status } = content
    let status
    if (series_status === 'pre') {
      status = 'Pre-Production'
    }
    if (series_status === 'prod') {
      status = 'Production'
    }
    if (series_status === 'post') {
      status = 'Post-Production'
    }

    return (
      <div className="summary-block">
        <img className="summary-img" src={testImg.src} />
        <p>{series_name}</p>
        <p>Currently in {status}</p>
        <button onClick = {() => getSpecificBTSContent('series', 'bts', bts_series_id)}>Get more info</button>
      </div>
    )
  }
  if (isBTSMovies(content)) {
    const { bts_movies_id, movie_id, movie_name, movie_thumbnail, movie_status } = content
    
    let status
    if (movie_status === 'pre') {
      status = 'Pre-Production'
    }
    if (movie_status === 'prod') {
      status = 'Production'
    }
    if (movie_status === 'post') {
      status = 'Post-Production'
    }

    return (
      <div className="summary-block">
        <img className="summary-img" src={testMovieImg.src} />
        <p>{movie_name}</p>
        <p>Currently in {status}</p>
        <button onClick = {() => getSpecificBTSContent('movies', 'bts', bts_movies_id)}>Get more info</button>
      </div>
    )
  }
}



export default Card