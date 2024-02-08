import {User, SeriesComment, MovieComment, PodcastComment} from "./interfaces"

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

const CommentBlock: React.FC<CommentBlockProps> = ({ content }) => {

    if (isSeriesComment(content)) {
        return (
            <>
                <div className="block">
                    <p>{content.series_comments_content}</p>
                </div>
                {content.replies?.length > 0 ?
                    <div className='block'>
                        {content.replies.map(comment => (
                            <CommentBlock key={comment.series_comments_id} content={comment} />
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