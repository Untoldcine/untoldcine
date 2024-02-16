import {User, SeriesComment, MovieComment, PodcastComment} from "./interfaces"
import {convertTime, calculateRating} from "./functions"
import axios from "axios";
import CommentEdit from "./commentEdit";
import CommentReply from "./commentReply";
import CommentRate from "./commentRate";

type Content = SeriesComment | MovieComment | PodcastComment

interface CommentBlockProps {
    content: Content
}

function isSeriesComment(comment: Content): comment is SeriesComment {
    return 'series_comments_id' in comment;
}

function isMovieComment(comment: Content): comment is MovieComment {
    return 'movie_comments_id' in comment;
}

function isPodcastComment(comment: Content): comment is PodcastComment {
    return 'podcast_comments_id' in comment;
}


const handleCommentDelete = async (userID: number, table: string, comment_id: number) => {
    try {
        const res = await axios.post(`http://localhost:3001/api/comments/removeComment/${userID}`, {
            table,
            comment_id
        })
    }
     catch(err) {
      console.error('Error attempting to delete comment');
    }
}

const CommentBlock: React.FC<CommentBlockProps> = ({ content }) => {

    if (isSeriesComment(content)) {        
        const {user, series_comments_id, series_comments_content, replies, date_created, series_comments_upvotes, series_comments_downvotes, edited, parent_series_id, ownComment, reviewed, reviewChoice} = content
        const {user_id, user_nickname} = user 
        console.log('reviewed?:' + reviewed);
        console.log('choice?:' + reviewChoice);
        
        
        if (ownComment) {
            return (
                <>
                <div className="self-block">
                    {edited ? <p style ={{fontSize:'0.6rem', fontStyle:'italic'}}>Edited</p> : null}
                    <p style = {{color: 'red'}}>{user_nickname}</p>
                    <p>{series_comments_content}</p>
                    <p>{convertTime(date_created)}</p>
                    <p>{calculateRating(series_comments_upvotes, series_comments_downvotes)}</p>
                    <CommentEdit id = {series_comments_id} text = {series_comments_content} table = 'series'/>
                    <button onClick = {() => handleCommentDelete(user_id, 'series', series_comments_id)}>Delete Comment</button>
                    <br/>
                    <CommentReply comment_id = {series_comments_id} table = 'series' parent_id = {parent_series_id}/>
                </div>
                {replies?.length > 0 ?
                    <div className='block'>
                        {content.replies.map(comment => (
                            <CommentBlock key={series_comments_id} content={comment} />
                        ))}
                    </div> : null}
                </>
            )
        }
        return (
            <>
                <div className="block">
                    {edited ? <p style ={{fontSize:'0.6rem', fontStyle:'italic'}}>Edited</p> : null}
                    <p style = {{color: 'red'}}>{user_nickname}</p>
                    <p>{series_comments_content}</p>
                    <p>{convertTime(date_created)}</p>
                    <CommentRate comment_id = {series_comments_id} table = 'series' reviewChoice = {reviewChoice}/>
                    <p>{calculateRating(series_comments_upvotes, series_comments_downvotes)}</p>
                    <br/>
                    <CommentReply comment_id = {series_comments_id} table = 'series' parent_id = {parent_series_id}/>
                </div>
                {replies?.length > 0 ?
                    <div className='block'>
                        {content.replies.map(comment => (
                            <CommentBlock key={series_comments_id} content={comment} />
                        ))}
                    </div> : null}
            </>
        )
    }

    if (isMovieComment(content)) {
        const {user, movie_comments_id, movie_comments_content, replies, date_created, movie_comments_upvotes, movie_comments_downvotes, edited, parent_movie_id, ownComment, reviewed, reviewChoice} = content
        const {user_id, user_nickname} = user 

        return (
            <>
                <div className="block">
                    {edited ? <p style ={{fontSize:'0.6rem', fontStyle:'italic'}}>Edited</p> : null}
                    <p style = {{color: 'red'}}>{user_nickname}</p>
                    <p>{movie_comments_content}</p>
                    <p>{convertTime(date_created)}</p>
                    <CommentRate comment_id = {movie_comments_id} table = 'movie' reviewChoice={reviewChoice}/>
                    <p>{calculateRating(movie_comments_upvotes, movie_comments_downvotes)}</p>
                    <CommentEdit id = {movie_comments_id} text = {movie_comments_content} table = 'movie'/>
                    <button onClick = {() => handleCommentDelete(user_id, 'movie', movie_comments_id)}>Delete Comment</button>
                    <br/>
                    <CommentReply comment_id = {movie_comments_id} table = 'movie' parent_id = {parent_movie_id}/>
                </div>
                {replies?.length > 0 ?
                    <div className='block'>
                        {content.replies.map(comment => (
                            <CommentBlock key={movie_comments_id} content={comment} />
                        ))}
                    </div> : null}
            </>
        )
    }

    if (isPodcastComment(content)) {
        const {user, podcast_comments_id, podcast_comments_content, replies, date_created, podcast_comments_upvotes, podcast_comments_downvotes, edited, parent_podcast_id, ownComment, reviewed, reviewChoice} = content
        const {user_id, user_nickname} = user 
        return (
            <>
                <div className="block">
                    {edited ? <p style ={{fontSize:'0.6rem', fontStyle:'italic'}}>Edited</p> : null}
                    <p style = {{color: 'red'}}>{user_nickname}</p>
                    <p>{podcast_comments_content}</p>
                    <p>{convertTime(date_created)}</p>
                    <CommentRate comment_id = {podcast_comments_id} table = 'podcast' reviewChoice={reviewChoice}/>
                    <p>{calculateRating(podcast_comments_upvotes, podcast_comments_downvotes)}</p>
                    <CommentEdit id = {podcast_comments_id} text = {podcast_comments_content} table = 'podcast'/>
                    <button onClick = {() => handleCommentDelete(user_id, 'podcast', podcast_comments_id)}>Delete Comment</button>
                    <br/>
                    <CommentReply comment_id = {podcast_comments_id} table = 'podcast' parent_id = {parent_podcast_id}/>
                </div>
                {replies?.length > 0 ?
                    <div className='block'>
                        {content.replies.map(comment => (
                            <CommentBlock key={podcast_comments_id} content={comment} />
                        ))}
                    </div> : null}
            </>
        )
    }

}

export default CommentBlock