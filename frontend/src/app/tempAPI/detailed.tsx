import { useState, useEffect } from 'react'

interface Series {
    ID: number,
    series_name: string,
    series_type: string,
    genres: string,
    rating: string,
    length: number | null,
    seasons: number,
    status: string,
    episodes: number | null,
    description: string,
    created: string
}

type DetailedProps = {
    content: Series
}

const Detailed: React.FC<DetailedProps> = ({ content }) => {
    const { ID, series_name, series_type, genres, rating, length, status, seasons, description, episodes, created } = content
    const { main } = JSON.parse(description);
    const [options, setOptions] = useState<string[]>([]);

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

    //loop through and create as many options as there are seasons
    useEffect(() => {
        const newOptions = [];
        for (let i = 1; i <= seasons; i++) {
            newOptions.push(`Season ${i}`);
        }
        setOptions(newOptions);
    }, [seasons]);



    return (
        <div className='block'>
            <h1>{series_name}</h1>
            {/* only render select option if the series is 'tv' */}
            {series_type === 'tv' ? (<select>
                {options.map((option, index) => (
                    <option key={index} value={index}>
                        {option}
                    </option>
                ))}
            </select>) : null}
            <p>{main}</p>
            <p>{showPositives}% of people like this!</p>
            <p>{genreArray}</p>
            <p>Placeholder for length</p>
        </div>
    )
}

export default Detailed