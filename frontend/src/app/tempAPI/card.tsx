'use client'
import {useState} from "react"
import axios from "axios"
import Detailed from "./detailed"
import Videos from "./videos"

interface Show {
    ID: number,
    series_name: string,
    series_type: string,
    genres: string,
    rating: string,
    length: number | null
}

interface VideoDetail {
  ID: number;
  name: string;
  episode: string;
  description: string;
}

type CardProps = {
    content: Show
}

const Card:React.FC<CardProps> = ({content}) => {    
  const {ID, series_name, series_type, genres, rating, length} = content 

  const [seriesDetails, setSeriesDetails] = useState(null)
  const [videoDetails, setVideoDetails] = useState<VideoDetail[]|[]>([])

  let showPositives
  let genreArray

  //parse and then calculate viewer ratings
  if (rating) {
    const { Upvotes, Downvotes } = JSON.parse(rating);
    showPositives = Math.floor((Upvotes / (Upvotes + Downvotes)) * 100)
  }
  //parse and display genres
  if (genres) {
    const genre = JSON.parse(genres)
    genreArray = genre.join(' ')
  }

  const getDeeperSeries = async (seriesID: number) => {
    try {
        const res = await axios.get(`http://localhost:3001/api/series/specific/${seriesID}`)
        
        const {seriesInfo, videos} = res.data        
        setSeriesDetails(seriesInfo)                
        setVideoDetails(videos)        
    }
    catch (err) {
        console.error(`Error attempting to get deeper series data at ID ${seriesID}: ${err}`);
    }
  }

  //TO FIX: The related videos should be a child component of the Detailed Series Component. We can then update the currently selected season (if its TV) state 
  //which will render the episodes that are only associated with that season.
  
  return (
    <>
    <div>
        <p>{series_name}</p>
        <p>{series_type}</p>
        {rating ? <p>{showPositives}% of people liked this!</p> : null }
        {genres ? <p>{genreArray}</p> : null}
        <button onClick = {() => getDeeperSeries(ID)}>Play Now</button>
    </div>
    {seriesDetails ? <Detailed content = {seriesDetails}/> : null}
    {videoDetails.length > 0 ? videoDetails.map((video) => {
      return <Videos key = {video.ID} content = {video}/>
    }): null}
    </>
  )
}

export default Card