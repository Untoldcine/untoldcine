import { useEffect, useState } from 'react'
import axios from 'axios'
import CommentComponent from './comment'


interface Podcast {
    ID: number,
    name: string,
    media_type: string,
}

type PodcastProps = {
    content: Podcast
}

interface DeeperPodcast {
    ID: number,
    name: string,
    media_type: string,
    rating: string | null,
    genre: string,
    episode: string | null
}

interface Comment {
    ID: number,
    content: string,
    date: string,
    parent_id: number | null,
    series_id: number | null,
    nickname: string,
    user_id: number,
    rating: string,
    replies: Comment[] | [],
    podcast_id: number | null
    btsflag: boolean | null,
    edited: boolean
    user_feedback: string | null

}

interface DBCommentObj {
    topLevel: Comment[] | null,
    allComments: Comment[] | null
}

const Podcasts: React.FC<PodcastProps> = ({ content }) => {

    const { ID, name } = content

    const [podcastDetails, setPodcastDetails] = useState<DeeperPodcast | null>(null)
    const [podcastComments, setPodcastComments] = useState<DBCommentObj | null>(null)
    const [newCommentValue, setNewCommentValue] = useState<string>('')
    const [submittedFeedback, setSubmittedFeedback] = useState<Boolean>(false)



    const getDeeperPodcastData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/podcast/specific/${ID}`)
            const { results } = res.data
            setPodcastDetails(results[0])
        }
        catch (err) {
            console.error(`Error attempting to get deeper series data at ID ${ID}: ${err}`);
        }
    }
    const getPodcastComments = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/comments/getPodcastDiscussion/${ID}`)
            setPodcastComments(res.data)            
        }
        catch (err) {
            console.error(`Error attempting to retrieve comments data: ${err}`);
        }
    }

    const parseCommentRating = (obj: string) => {
        if (!obj) {
            return 0
        }
        const {up, down} = JSON.parse(obj)
        return up - down
    }

    const addToWatchList = async () => {
        axios.post('http://localhost:3001/api/watchlist/add', {
          user_id: 2,
          content_type: 'podcast',
          content_id: ID
        })
          .then((res) => {
            if (res.data === 'OK') {
              console.log('added to watchlist successfully');
    
            }
          })
          .catch((err) => {
            console.log(err);
    
          })
      }
    
    const postNewComment = async (e:React.FormEvent) => {
        e.preventDefault()
        const commentObj = {
            content: newCommentValue,
            ID,
            table_name: 'podcast_comments'
        }
        try {
            const res = await axios.post('http://localhost:3001/api/comments/newComment/16', commentObj)    //16 is placeholder for the :userID 
            if (res.status === 200) {
                setNewCommentValue('')
            }
            
        }
        catch (err) {
            console.error(`Error attempting to POST new comment data: ${err}`);
        }
    }

    const handleUserFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ratingObj = {
            userID: 16,
            content_ID: ID,
            table: 'podcasts'
        }
        //attach this object, keep the submitter as a params, and change route to user so we can apply this to all tables
        const submitter = (e.nativeEvent as any).submitter as HTMLInputElement;
        axios.post(`http://localhost:3001/api/user/rating/${submitter.name}`, ratingObj)
            .then((res) => {
                setSubmittedFeedback(true)
            })
            .catch((err) => {
                console.error(err);
            })
    }

    return (
        <div className='block'>
            <p>PODCASTS = {name}</p>
            <button onClick={() => getDeeperPodcastData()}>See More</button>
            <br></br>
            {/* <button onClick={() => addToWatchList()}>Add to Watchlist</button> */}
            <form className='block' onSubmit = {(e) => postNewComment(e)}>
                <input value = {newCommentValue} onChange = {(e) => setNewCommentValue(e.target.value)}></input>
                <button>Submit Comment</button>
            </form>
            {submittedFeedback ?
                <div className='block'>
                    <p>Thank you for your feedback!</p>
                </div> :
                <form className='block' onSubmit={(e) => handleUserFeedback(e)}>
                    <button name='like'>Like</button>
                    <br></br>
                    <button name='dislike'>Dislike</button>
                </form>}
            {podcastDetails &&
                <div className='block'>
                    <h1>{podcastDetails.name}</h1>
                    <p>{podcastDetails.rating}</p>
                    <p>{podcastDetails.genre}</p>
                    <p>{podcastDetails.episode}</p>
                    <button disabled>Play Episode</button>
                    <br></br>
                    <button onClick = {() => getPodcastComments()}>See Comments</button>
                    {podcastComments && podcastComments.topLevel?.map((comment) => {
                       return <CommentComponent key = {comment.ID} post = {comment}/>
                    })}
                </div>}
            
        </div>
    )
}

export default Podcasts