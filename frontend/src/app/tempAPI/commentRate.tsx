import axios from 'axios';
import React from 'react'

type CommentRateProps = {
    comment_id: number
    table: string
}

const CommentRate:React.FC<CommentRateProps> = ({comment_id, table}) => {
    const userID = 19

    const submitRating = async (e:React.FormEvent) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as any).submitter as HTMLInputElement; //gets the 'name' of the button
        
        try {
            const res = await axios.post(`http://localhost:3001/api/user/rating/${submitter.name}`, {
                userID,
                comment_id,
                table
            })
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
        <button name = "up">Up</button>
        <button name = "down">Down</button>
    </form>
  )
}

export default CommentRate