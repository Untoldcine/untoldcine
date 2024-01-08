import axios from 'axios'
import React, { useState, useEffect } from 'react'

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
    const { main, advisory, starring, producers, directors } = JSON.parse(description);
    const [options, setOptions] = useState<string[]>([]);
    const [comments, setComments] = useState<Comment[]>([])
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

    const parseCommentRating = (obj: string) => {
        if (!obj) {
            return 0
        }
        const {up, down} = JSON.parse(obj)
        return up - down
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
                {comments ? comments.map((comment) => {
                    return (
                        <div className='block'>
                            <p>{comment.nickname}</p>
                            <p>{comment.content}</p>
                            <p>Overall comment score: {parseCommentRating(comment.votes)}</p>
                            <p>Comment submitted: x time ago, needs further processing with comments.date value</p>
                            {/* <form className='block'>
                                <p>Rate this comment</p>
                                <button name='like'>Like</button>
                                <br/>
                                <button name='dislike'>Dislike</button>
                                </form> */}
                            <button>Reply</button>
                        </div>)
                }) : null}
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