'use client'
import axios from "axios"
import { useState, useEffect } from "react"

interface CommentInputProps {
    table_name: string
    content_id: number
}

const CommentInput:React.FC<CommentInputProps> = ({table_name, content_id}) => {
    const user_id = 19 //hard coded to my test profile

    const [newCommentValue, setNewCommentValue] = useState<string>('')

    const postNewComment = async () => {        
        try {
            const res = await axios.post(`http://localhost:3001/api/comments/newComment/${user_id}`, {
                table_name,
                content_id,
                comment: newCommentValue
            })
            console.log(res.data);
            setNewCommentValue('')
        }
        catch(err) {
            console.error(err + ': Error posting new comment');
            
        }
    }


    return (
        <>
            <label style={{ color: 'white', paddingRight: '1rem' }}>New Comment</label>
            <input className="inputs" value = {newCommentValue} onChange = {(e) => setNewCommentValue(e.target.value) }></input>
            <button onClick = {() => postNewComment()}>Submit Comment</button>
        </>
    )
}

export default CommentInput