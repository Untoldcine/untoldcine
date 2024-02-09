'use client'
import axios from 'axios'
import { useState } from 'react'

type CommentEditProps = {
    id: number
    text: string
    table: string
}

const CommentEdit: React.FC<CommentEditProps> = ({ id, text, table }) => {
    const [editInput, setEditInput] = useState<boolean>(false)
    const [commentValue, setCommentValue] = useState<string>(text)    

    const handleEditComment = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/api/comments/editComment`, {
                editedComment: commentValue,
                table,
                comment_id: id
            })
            if (res.status === 200) {
                setEditInput(false)
            }
        }
        catch (err) {
            console.error(err + ' :Error editing comment');

        }
    }


    return (
        <>
            {editInput ? <input className='inputs' value={commentValue} onChange={(e) => setCommentValue(e.target.value)} /> : null}
            {editInput ? <button onClick={() => handleEditComment()}>Accept Edit</button> : <button onClick={() => setEditInput(true)}>Edit Comment</button>}
            <br />
        </>
    )
}

export default CommentEdit