'use client'
import axios from "axios"
import { useState } from "react"
import {SeriesSummary, MovieSummary, PodcastSummary, BTSSeriesSummary, BTSMoviesSummary} from "./interfaces"
import testImg from "./testimg.jpeg"
import testPod from "./testPodcast.jpeg"
import testMovieImg from "./testmovie.png"
import "./tempstyles.css"
import MediaRating from "./mediaRating"
import Comment from "./comments"
import CommentInput from "./commentInput"

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
    // console.log(content_id);
    
    try {
      const res = await axios.get(`http://localhost:3001/api/${content}/comments/${content_id}`, {withCredentials: true})
      // console.log(res.data);
      
      setCommentArray(res.data)
      
    }
    catch(err) {
      console.error('Error attempting to GET comments data');
    }
  }

  const addToWatchList = async (content: string, content_id: number) => {
    try {
      const res = await axios.post(`http://localhost:3001/api/watchlist/add`, {
        content,
        content_id
      }, {
        withCredentials: true
      })
      if (res.status === 200) {
        console.log('ok!');
        
      }
    }
    catch(err) {
      console.error(err + `: Error adding ${content} at ID ${content_id} to watchlist`);
      
    }
  }

  if (isSeries(content)) {
    const { series_id, series_name, series_thumbnail, genres, series_length, reviewed } = content        

    return (
      <>
      <div className="summary-block">
        <img className="summary-img" src={testImg.src} />
        <p>{series_name}</p>
        <p>{series_length} episodes</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
        {reviewed ? <p style = {{color: 'orange'}}>Already submitted rating</p>:<MediaRating table_name = 'series' content_id = {series_id}/>}
        <button onClick = {() => getSpecificContent('series', series_id)}>Get more info</button>
        <button onClick = {() => getComments('series', series_id)}>Get comments</button>
        {/* <button onClick = {() => addToWatchList('bts_series', 8)}>Add to Watchlist</button> */}
      </div>
      <div className="comment-block">
        <CommentInput table_name = 'series' content_id = {series_id}/>
        <Comment array = {commentArray}/>
      </div>
      </>
    )
  }
  if (isMovie(content)) {    
    const {movie_id, movie_name, movie_thumbnail, genres, movie_length, reviewed} = content
    return (
      <>
      <div className="summary-block">
        <img className="summary-img" src={testMovieImg.src} />
        <p>{movie_name}</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
        {reviewed ? <p style = {{color: 'orange'}}>Already submitted rating</p>:<MediaRating table_name = 'movies' content_id = {movie_id}/>}
        <button onClick = {() => getSpecificContent('movies', movie_id)}>Get more info</button>
        <button onClick = {() => getComments('movies', movie_id)}>Get comments</button>
      </div>
      <div className="comment-block">
        <CommentInput table_name = 'movie' content_id = {movie_id}/>
        <Comment array = {commentArray}/>
      </div>      </>
    )
  }
  if (isPodcast(content)) {
    const {podcast_id, podcast_name, podcast_thumbnail, podcast_status, reviewed} = content
    return (
      <>
      <div className="summary-block">
        <img className="summary-img" src={testPod.src} />
        <p>{podcast_name}</p>
        {reviewed ? <p style = {{color: 'orange'}}>Already submitted rating</p>:<MediaRating table_name = 'podcasts' content_id = {podcast_id}/>}
        <button onClick = {() => getSpecificContent('podcast', podcast_id)}>Get more info</button>
        <button onClick = {() => getComments('podcast', podcast_id)}>Get comments</button>
      </div>
      <div className="comment-block">
        <CommentInput table_name = 'podcast' content_id = {podcast_id}/>
        <Comment array = {commentArray}/>
      </div>      </>
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
      <>
      <div className="summary-block">
        <img className="summary-img" src={testImg.src} />
        <p>{series_name}</p>
        <p>Currently in {status}</p>
        <button onClick = {() => getSpecificBTSContent('series', 'bts', series_id)}>Get more info</button>
      </div>
      </>
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
        <button onClick = {() => getSpecificBTSContent('movies', 'bts', movie_id)}>Get more info</button>
      </div>
    )
  }
}



export default Card