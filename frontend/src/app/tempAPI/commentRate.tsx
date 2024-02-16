import axios from 'axios';
import React from 'react'

type CommentRateProps = {
    comment_id: number
    table: string
    reviewChoice: string | null
}

const CommentRate:React.FC<CommentRateProps> = ({comment_id, table, reviewChoice}) => {
    const submitRating = async (e:React.FormEvent) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as any).submitter as HTMLInputElement; //gets the 'name' of the button
        
        try {
            const res = await axios.post(`http://localhost:3001/api/user/rating/${submitter.name}`, {
                comment_id,
                table
            },
            {withCredentials: true}
            )
            if (res.status === 200) {
                console.log('ok');
                
            }
        }
        catch(err) {
            console.error(err);
        }
    }



  return (
    <form className='block' onSubmit = {(e) => submitRating(e)}>
        {reviewChoice === 'up' ? <button name = "up" className='like-button-done'>Up</button> : <button name = "up">Up</button>}
        {reviewChoice === 'down' ? <button name = "down" className='dislike-button-done'>Down</button> : <button name = "down">Down</button>}
    </form>
  )
}

export default CommentRate