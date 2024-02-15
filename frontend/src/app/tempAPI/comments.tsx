// import { useState, useEffect } from "react"
import CommentBlock from "./commentBlock"
import {User, SeriesComment, MovieComment, PodcastComment} from "./interfaces"


type CommentArray = SeriesComment[] | MovieComment[] | PodcastComment[]

type CommentProps = {
    array: CommentArray
}

function isSeriesComment(comment: any): comment is SeriesComment {
    return 'series_comments_id' in comment;
}

function isMovieComment(comment: any): comment is MovieComment {
    return 'movie_comments_id' in comment;
}

function isPodcastComment(comment: any): comment is PodcastComment {
    return 'podcast_comments_id' in comment;
}

const Comments: React.FC<CommentProps> = ({ array }) => {
    // console.log(array);

    return (
        <>
            {array.map((comment) => {
                if (isSeriesComment(comment)) {
                    return (
                        <CommentBlock key = {comment.series_comments_id} content = {comment}/>
                     )
                }
                if (isMovieComment(comment)) {
                    return (
                        <CommentBlock key = {comment.movie_comments_id} content = {comment}/>
                     )
                }
                if (isPodcastComment(comment)) {
                    return (
                        <CommentBlock key = {comment.podcast_comments_id} content = {comment}/>
                     )
                }
                
            })}
        </>
    )
}

export default Comments