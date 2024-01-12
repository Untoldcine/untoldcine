import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CommentComponent from './comment'

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
    series_id: number | null,
    nickname: string,
    user_id: number,
    votes: string,
    replies: Comment[] | [],
    podcast_id: number | null
}


//DB sends an object with all comments associated with the series and all top-level comments with no parent comment
interface DBCommentObj {
    topLevel: Comment[] | null,
    allComments: Comment[] | null
}

const Detailed: React.FC<DetailedProps> = ({ content }) => {
    const { ID, series_name, series_type, genres, rating, length, status, seasons, description, episodes, created } = content
    const { main, advisory, starring, producers, directors } = JSON.parse(description);

    const [options, setOptions] = useState<string[]>([]);
    const [comments, setComments] = useState<DBCommentObj | null>(null)
    const [submittedFeedback, setSubmittedFeedback] = useState<Boolean>(false)
    const [altDetails, setAltDetails] = useState<Boolean>(false)

    const dateString = new Date(created)
    const year = dateString.getFullYear()

    let showPositives
    let genreArray
    let formattedLength

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
    //parse and display length of content
    if (length) {
        if (length > 60) {
            const hour = Math.floor(length / 60)
            const minutes = length % 60
            formattedLength = `${hour} h ${minutes} min`
        }
        else {
            formattedLength = `${length} min`
        }

    }

    //loop through and create as many options as there are seasons
    useEffect(() => {
        const newOptions = [];
        for (let i = 1; i <= seasons; i++) {
            newOptions.push(`Season ${i}`);
        }
        setOptions(newOptions);
    }, [seasons]);

    useEffect(() => {

    }, [])

    const getComments = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/comments/getDiscussion/${ID}`)            
            setComments(res.data)
        }
        catch (err) {
            console.error(`Error attempting to retrieve comments data: ${err}`);
        }
    }

    //currently hard coded to use :userID = 2, but will change that to handle the logged in user's identifier
    //submitter.name catches whether choice was upvote or downvote and posts to DB
    const handleUserFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as any).submitter as HTMLInputElement;
        axios.post(`http://localhost:3001/api/series/rating/2/${ID}/${submitter.name}`)
            .then((res) => {
                setSubmittedFeedback(true)
            })
            .catch((err) => {
                console.error(err);
            })
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
            {series_type === 'movie' ? <p>{formattedLength}</p> : null}
            {series_type === 'tv' ? <p>{year}</p> : null}
            {series_type === 'tv' ? <p>{episodes} Episodes</p> : null}
            {submittedFeedback ?
                <div className='block'>
                    <p>Thank you for your feedback!</p>
                </div> :
                <form className='block' onSubmit={(e) => handleUserFeedback(e)}>
                    <button name='like'>Like</button>
                    <br></br>
                    <button name='dislike'>Dislike</button>
                </form>}
            <button disabled>Play Now</button>
            <p>Placeholder: Which current episode they're on</p>
            <br></br>
            <button onClick={() => getComments()}>See 'Discussion' or comments related to series</button>
            <br></br>
            <button onClick={() => setAltDetails(!altDetails)}>See 'Details' or comments related to series</button>
            <div className='block'>
                {comments && comments.topLevel?.map((comment) => {
                    return <CommentComponent key = {comment.ID} post = {comment}/>
                })}
            </div>
            {altDetails ? <div className='block'>
                <p>Advisory Warning: {advisory}</p>
                <p>Directors: {directors}</p>
                <p>Producers: {producers}</p>
                <p>Starring: {starring}</p>
            </div> : null}
        </div>
    )
}

export default Detailed