import React from 'react'

interface Comment {
    ID: number,
    content: string,
    date: string,
    parent_id: number | null,
    series_id: number,
    nickname: string,
    user_id: number,
    votes: string,
    replies: Comment[] | []
}

type CommentProp = {
    post: Comment
}

//Checks if comments contain replies and recursively renders them
const Comment: React.FC<CommentProp> = ({ post }) => {
    const { nickname, content, replies, votes } = post

    const parseCommentRating = (obj: string) => {
        if (!obj) {
            return 0
        }
        const {up, down} = JSON.parse(obj)
        return up - down
    }

    return (
        <>
            <div className='block'>
                <p>{nickname}</p>
                <p>{content}</p>
                <p>Overall comment score: {parseCommentRating(votes)}</p>
                <p>Comment submitted: x time ago, needs further processing with comments.date value</p>
                <button>Reply</button>
                <div className='block'>
                    {replies.length > 0 && replies.map(comment => (
                        <Comment key = {comment.ID} post = {comment}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Comment