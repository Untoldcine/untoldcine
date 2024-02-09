import {User, SeriesComment, MovieComment, PodcastComment} from "./interfaces"
import {convertTime, calculateRating} from "./functions"
import axios from "axios";

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
    const user_id = 19

    if (isSeriesComment(content)) {        
        const {user, series_comments_id, series_comments_content, replies, date_created, series_comments_upvotes, series_comments_downvotes} = content
        const {user_id, user_nickname} = user 
        return (
            <>
                <div className="block">
                    <p style = {{color: 'red'}}>{user_nickname}</p>
                    <p>{series_comments_content}</p>
                    <p>{convertTime(date_created)}</p>
                    <p>{calculateRating(series_comments_upvotes, series_comments_downvotes)}</p>
                    <button onClick = {() => handleCommentDelete(user_id, 'series', series_comments_id)}>Delete Comment</button>
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
        return (
            <>
                <div className="block">
                    <p>{content.movie_comments_content}</p>
                </div>
                {content.replies?.length > 0 ?
                    <div className='block'>
                        {content.replies.map(comment => (
                            <CommentBlock key={comment.movie_comments_id} content={comment} />
                        ))}
                    </div> : null}
            </>
        )
    }

    if (isPodcastComment(content)) {
        return (
            <>
                <div className="block">
                    <p>{content.podcast_comments_content}</p>
                </div>
                {content.replies?.length > 0 ?
                    <div className='block'>
                        {content.replies.map(comment => (
                            <CommentBlock key={comment.podcast_comments_id} content={comment} />
                        ))}
                    </div> : null}
            </>
        )
    }

}

export default CommentBlock