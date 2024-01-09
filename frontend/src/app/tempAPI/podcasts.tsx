import { useEffect, useState } from 'react'
import axios from 'axios'


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
    podcast_id: number,
    nickname: string,
    user_id: number,
    votes: string
}

const Podcasts: React.FC<PodcastProps> = ({ content }) => {

    const { ID, name } = content

    const [podcastDetails, setPodcastDetails] = useState<DeeperPodcast | null>(null)
    const [podcastComments, setPodcastComments] = useState<Comment[]|[]>([])
    const [getRelatedContent, setGetRelatedContent] = useState<Boolean>(false)

    const getDeeperPodcastData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/podcast/specific/${ID}`)
            const { results } = res.data
            setPodcastDetails(results[0])
            setGetRelatedContent(true)
        }
        catch (err) {
            console.error(`Error attempting to get deeper series data at ID ${ID}: ${err}`);
        }
    }

    // useEffect(() => {
    //     if (podcastComments) {
    //         axios.get(`http://localhost:3001/api/podcast/specific/${ID}`)
    //     }
    // }, [podcastComments])

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

    return (
        <div className='block'>
            <p>PODCASTS = {name}</p>
            <button onClick={() => getDeeperPodcastData()}>See More</button>
            <br></br>
            <button onClick={() => addToWatchList()}>Add to Watchlist</button>
            {podcastDetails &&
                <div className='block'>
                    <h1>{podcastDetails.name}</h1>
                    <p>{podcastDetails.rating}</p>
                    <p>{podcastDetails.genre}</p>
                    <p>{podcastDetails.episode}</p>
                    <button disabled>Play Episode</button>
                    <br></br>
                    <button onClick = {() => getPodcastComments()}>See Comments</button>
                    {podcastComments.length > 0 ? podcastComments.map((comment) => {
                        return <div className = "block">
                            <p>{comment.nickname}</p>
                            <p>{comment.content}</p>
                            <p>Overall comment score: {parseCommentRating(comment.votes)}</p>
                            <p>Comment submitted: x time ago, needs further processing with comments.date value</p>
                        </div>
                    }): null}
                </div>}
            
        </div>
    )
}

export default Podcasts