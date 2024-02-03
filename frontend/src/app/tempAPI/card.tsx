'use client'
import { useState } from "react"
import Link from "next/link";
import axios from "axios"
import Detailed from "./detailed"
import Videos from "./videos"

import testImg from "./testimg.jpeg"
import testPod from "./testPodcast.jpeg"
import testMovieImg from "./testmovie.png"
import "./tempstyles.css"

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

interface VideoDetail {
  ID: number;
  name: string;
  episode: string;
  description: string;
}

type Content = SeriesSummary | MovieSummary | PodcastSummary | BTSSeriesSummary;

interface CardProps {
  content: Content;
}


const Card: React.FC<CardProps> = ({ content }) => {

  //type guards
  function isSeries(content: Content): content is SeriesSummary {
    return (content as SeriesSummary).series_id !== undefined && (content as BTSSeriesSummary).bts_series_id === undefined;
    ;
  }

  function isMovie(content: Content): content is MovieSummary {
    return (content as MovieSummary).movie_id !== undefined;
  }

  function isPodcast(content: Content): content is PodcastSummary {
    return (content as PodcastSummary).podcast_id !== undefined;
  }

  function isBTSSeries(content: Content): content is SeriesSummary {
    return (content as SeriesSummary).series_id !== undefined && (content as BTSSeriesSummary).bts_series_id !== undefined;
    ;
  }



  const [seriesDetails, setSeriesDetails] = useState(null)
  const [videoDetails, setVideoDetails] = useState<VideoDetail[] | []>([])

  let showPositives
  let genreArray
  let formattedLength

  //parse and then calculate viewer ratings
  // if (rating) {
  //   const { Upvotes, Downvotes } = JSON.parse(rating);
  //   showPositives = Math.floor((Upvotes / (Upvotes + Downvotes)) * 100)
  // }
  // //parse and display genres
  // if (genres) {
  //   const genre = JSON.parse(genres)
  //   genreArray = genre.join(' ')
  // }

  // //format length which comes as total minutes. If <60min, display just the length and handle down in the markup itself
  // if (length) {
  //   if (length > 60) {
  //     const hour = Math.floor(length / 60)
  //     const minutes = length % 60
  //     formattedLength = `${hour} h ${minutes} min`
  //   }
  //   else {
  //     formattedLength = `${length} min`
  //   }

  // }

  //currently uses 'userID' to flag which user is saving which piece of content. However this can introduce security risks
  //Need a more sophisticated way to save it
  // const addToWatchList = async () => {
  //   axios.post('http://localhost:3001/api/watchlist/add', {
  //     user_id: 2,
  //     content_type: series_type,
  //     content_id: ID
  //   })
  //     .then((res) => {
  //       if (res.data === 'OK') {
  //         console.log('added to watchlist successfully');

  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);

  //     })
  // }

  const getDeeperSeries = async (seriesID: number) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/series/specific/${seriesID}`)

      const { seriesInfo, videos } = res.data
      setSeriesDetails(seriesInfo)
      setVideoDetails(videos)
    }
    catch (err) {
      console.error(`Error attempting to get deeper series data at ID ${seriesID}: ${err}`);
    }
  }

  //TO FIX: The related videos should be a child component of the Detailed Series Component. We can then update the currently selected season (if its TV) state 
  //which will render the episodes that are only associated with that season.

  if (isSeries(content)) {
    const { series_id, series_name, series_thumbnail, genres, series_length } = content

    return (
      <div className="summary-block">
        <img className="summary-img" src={testImg.src} />
        <p>{series_name}</p>
        <p>{series_length} episodes</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
        {/* <button disabled onClick={() => addToWatchList()}>Add to Watchlist</button> */}
      </div>
      //   {/* {seriesDetails ? <Detailed content={seriesDetails} /> : null}
      //   <div className="related-block">
      //     {videoDetails.length > 0 ? videoDetails.map((video) => {
      //       return <Videos key={video.ID} content={video} />
      //     }) : null}
      //   </div> */}
      // {/*  </Link> */}
    )
  }
  if (isMovie(content)) {
    const {movie_id, movie_name, movie_thumbnail, genres, movie_length} = content
    return (
      <div className="summary-block">
        <img className="summary-img" src={testMovieImg.src} />
        <p>{movie_name}</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
      </div>
    )
  }

  if (isPodcast(content)) {
    const {podcast_id, podcast_name, podcast_thumbnail, podcast_status} = content
    return (
      <div className="summary-block">
        <img className="summary-img" src={testPod.src} />
        <p>{podcast_name}</p>
      </div>
    )
  }

  if (isBTSSeries(content)) {
    const { series_id, series_name, series_thumbnail, series_status } = content
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
      </div>
    )
  }
}

export default Card