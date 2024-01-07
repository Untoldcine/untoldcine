import axios from "axios"

type Show =  {
    ID: number,
    series_name: string,
    series_type: string,
    genres: any,
    rating: any,
    length: number | null
}

type CardProps = {
    content: Show
}

const Card:React.FC<CardProps> = ({content}) => {    
  const {ID, series_name, series_type, genres, rating, length} = content 

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
        console.log(res.data);
        
    }
    catch (err) {
        console.error(`Error attempting to get deeper series data at ID ${seriesID}: ${err}`);
    }
  }
  
  return (
    <div className = "block">
        <p>{ID}</p>
        <p>{series_name}</p>
        <p>{series_type}</p>
        {rating ? <p>{showPositives}% of people liked this!</p> : null }
        {genres ? <p>{genreArray}</p> : null}
        <button onClick = {() => getDeeperSeries(ID)}>Play Now</button>
    </div>
  )
}

export default Card