import axios from 'axios'
import React from 'react'

type MediaRatingProps = {
    table_name : string
    content_id: number
}


const MediaRating:React.FC<MediaRatingProps> = ({table_name, content_id}) => {

    const submitMediaRating = async (e:React.FormEvent) => {
        e.preventDefault()
        const submitter = (e.nativeEvent as any).submitter as HTMLInputElement; 
        try {
            const res = await axios.post(`http://localhost:3001/api/user/mediaRating/${submitter.name}`, {
                table_name,
                content_id
            }, {withCredentials: true})
            if (res.status === 200) {
                console.log('ok');
            }
        }
        catch(err) {
            console.error(err + ': Error submitting feedback for media');
        }
    }


    return (
        <form className="block"  onSubmit = {(e) => submitMediaRating(e)}>
            <button name = "up">Thumbs Up</button>
            <button name = "down">Thumbs Down</button>
        </form>
    )
}

export default MediaRating