import { useState } from 'react'
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

    const getDeeperPodcastData = async (podcastID: number) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/podcast/specific/${podcastID}`)
            const { results } = res.data
            setPodcastDetails(results[0])
        }
        catch (err) {
            console.error(`Error attempting to get deeper series data at ID ${podcastID}: ${err}`);
        }
    }

    const getPodcastComments = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/comments/getPodcastDiscussion/${ID}`)
            setPodcastComments(res.data)
            console.log(res.data);
            
        }
        catch (err) {
            console.error(`Error attempting to retrieve comments data: ${err}`);
        }
    }

    return (
        <div className='block'>
            <p>PODCASTS = {name}</p>
            <button onClick={() => getDeeperPodcastData(ID)}>See More</button>
            {podcastDetails &&
                <div className='block'>
                    <h1>{podcastDetails.name}</h1>
                    <p>{podcastDetails.rating}</p>
                    <p>{podcastDetails.genre}</p>
                    <p>{podcastDetails.episode}</p>
                    <button>Play Episode</button>
                    <button onClick = {() => getPodcastComments()}>See Comments</button>
                    {podcastComments.length > 0 ? podcastComments.map((comment) => {
                        return <div className = "block">
                            <p>{comment.nickname}</p>
                            <p>{comment.content}</p>
                        </div>
                    }): null}
                </div>}
        </div>
    )
}

export default Podcasts