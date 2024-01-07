import React from 'react'

interface Series {
    ID: number,
    series_name: string,
    series_type: string,
    genres: string,
    rating: string,
    length: number | null,
    status: string,
    episodes: number | null,
    description: string,
    created: string
}

type DetailedProps = {
    content: Series
}

const Detailed: React.FC<DetailedProps> = ({ content }) => {
    const { ID, series_name, series_type, genres, rating, length, status, description, episodes, created } = content
    const {main} = JSON.parse(description);
    // console.log(main);

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
    
    

    return (
        <div className='block'>
            <h1>{series_name}</h1>
            <p>{main}</p>
            <p>{showPositives}% of people like this!</p>
            <p>{genreArray}</p>
            <p>Placeholder for length</p>
        </div>
    )
}

export default Detailed