'use client'
import axios from "axios"
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

interface BTSMoviesSummary {
  movie_id: number
  bts_movies_id: number
  movie_name: string
  movie_status: string
  movie_thumbnail: string | null
}

type Content = SeriesSummary | MovieSummary | PodcastSummary | BTSSeriesSummary | BTSMoviesSummary;

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
    return (content as MovieSummary).movie_id !== undefined && (content as BTSMoviesSummary).bts_movies_id === undefined;
  }

  function isPodcast(content: Content): content is PodcastSummary {
    return (content as PodcastSummary).podcast_id !== undefined;
  }

  function isBTSSeries(content: Content): content is BTSSeriesSummary {
    return (content as BTSSeriesSummary).series_id !== undefined && (content as BTSSeriesSummary).bts_series_id !== undefined;
    ;
  }

  function isBTSMovies(content: Content): content is BTSMoviesSummary {
    return (content as BTSMoviesSummary).movie_id !== undefined && (content as BTSMoviesSummary).bts_movies_id !== undefined;
    ;
  }

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

  if (isSeries(content)) {
    const { series_id, series_name, series_thumbnail, genres, series_length } = content

    return (
      <div className="summary-block">
        <img className="summary-img" src={testImg.src} />
        <p>{series_name}</p>
        <p>{series_length} episodes</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
        <button onClick = {() => getSpecificContent('series', series_id)}>Get more info</button>
      </div>
    )
  }
  if (isMovie(content)) {    
    const {movie_id, movie_name, movie_thumbnail, genres, movie_length} = content
    return (
      <div className="summary-block">
        <img className="summary-img" src={testMovieImg.src} />
        <p>{movie_name}</p>
        {genres.map((genre) => <p key={genre}>{genre}</p>)}
        <button onClick = {() => getSpecificContent('movies', movie_id)}>Get more info</button>
      </div>
    )
  }
  if (isPodcast(content)) {
    const {podcast_id, podcast_name, podcast_thumbnail, podcast_status} = content
    return (
      <div className="summary-block">
        <img className="summary-img" src={testPod.src} />
        <p>{podcast_name}</p>
        <button onClick = {() => getSpecificContent('podcast', podcast_id)}>Get more info</button>
      </div>
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