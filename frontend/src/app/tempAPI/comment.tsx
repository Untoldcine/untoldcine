import axios from 'axios'
import React, { useState, useEffect } from 'react'

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

type CommentProp = {
    post: Comment
}

//Checks if comments contain replies and recursively renders them
const Comment: React.FC<CommentProp> = ({ post }) => {    
    const { ID, nickname, content, replies, votes, series_id, podcast_id } = post
    const [replyValue, setReplyValue] = useState<string>('')
    const userID = 16 //hard coded to the comment_tester User
    let table:string;
    if (series_id) {
        table = 'comments'
    }

    const handleReplyValue = (e:any) => {
        setReplyValue(e.target.value)
    }

    const handleReplySubmit = async () => {
        const replyObj = {
            content: replyValue,
            parent_id: ID,
            series_id,
            table
        }
        try {
            const res = await axios.post(`http://localhost:3001/api/comments/newReply/${userID}`, replyObj)
            if (res.status === 200) {
                setReplyValue('')
            }
        }
        catch (err) {
            console.error(`Error attempting to post new comments data: ${err}`);
        }
                    
    }

    const parseCommentRating = (obj: string) => {
        if (!obj) {
            return 0
        }
        const {up, down} = JSON.parse(obj)
        return up - down
    }

    const handleUserFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as any).submitter as HTMLInputElement;
        axios.post(`http://localhost:3001/api/comments/rating/${userID}/${ID}/${submitter.name}`)
            .then((res) => {
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const handleDeleteComment = async () => {
        //this button should only be available to comments that match the user's ID
        const deleteCommentDetails = {
            content_ID: ID,
            content_type: table
        }
        try {
            axios.post(`http://localhost:3001/api/comments/removeComment/${userID}`, deleteCommentDetails)
        }
        catch (err) {
            console.error(`Error attempting to delete comments data: ${err}`);
        }
    }

    return (
        <>
            <div className='block'>
                <p>{nickname}</p>
                <p>{content}</p>
                <p>Overall comment score: {parseCommentRating(votes)}</p>
                <p>Comment submitted: x time ago, needs further processing with comments.date value</p>
                <button onClick = {() => handleDeleteComment()}>DELETE THIS COMMENT</button>
                <br/>
                <form className='block' onSubmit={(e) => handleUserFeedback(e)}>
                    <button name='up'>Like Comment</button>
                    <br></br>
                    <button name='down'>Dislike Comment</button>
                </form>
                <input value = {replyValue} onChange = {(e) => handleReplyValue(e)}/>
                <button onClick = {() => handleReplySubmit()}>Reply</button>
                {replies.length > 0 ? 
                    <div className='block'>
                    {replies.map(comment => (
                        <Comment key = {comment.ID} post = {comment}/>
                    ))}
                </div> : null}
            </div>
        </>
    )
}

export default Comment