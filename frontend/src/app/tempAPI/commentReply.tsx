'use client'
import axios from 'axios'
import { useState } from 'react'

type CommentReplyProps = {
  comment_id: number
  table: string
  parent_id: number
}

const CommentReply:React.FC<CommentReplyProps> = ({comment_id, table, parent_id}) => {

  const [replyValue, setReplyValue] = useState<string>('')

  const handleCommentReply = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/api/comments/newReply`, {
        parent_comment_id: comment_id,
        parent_content_id: parent_id,
        comment: replyValue,
        table
      },
      {withCredentials: true}
      )
    }
    catch(err) {
      console.error(err);
      
    }
  }

  return (
    <>
      <input type = 'text' className='reply' value = {replyValue} onChange = {(e) => setReplyValue(e.target.value)}/>
      <button onClick = {() => handleCommentReply()}>Reply to this comment</button>
      <br/>
    </>
  )
}

export default CommentReply