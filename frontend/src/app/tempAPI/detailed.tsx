import axios from 'axios'
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

interface Comment {
    ID: number,
    content: string,
    date: string,
    parent_id: number | null,
    series_id: number,
    nickname: string,
    user_id: number,
    votes: string
}

const Detailed: React.FC<DetailedProps> = ({ content }) => {
    const { ID, series_name, series_type, genres, rating, length, status, seasons, description, episodes, created } = content
    const { main } = JSON.parse(description);
    const [options, setOptions] = useState<string[]>([]);
    const [comments, setComments] = useState<Comment[]>([])

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

    const getComments = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/comments/getDiscussion/${ID}`)
            setComments(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve comments data: ${err}`);
        }
    }


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
            <button onClick={() => getComments()}>See 'Discussion' or comments related to series</button>
            <div className='block'>
                {comments ? comments.map((comment) => {
                    return (
                        <div className='block'>
                            <p>{comment.nickname}</p>
                            <p>{comment.content}</p>
                        </div>)
                }) : null}
            </div>
        </div>
    )
}

export default Detailed