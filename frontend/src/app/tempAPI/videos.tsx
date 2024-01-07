import React from 'react'

interface Videos {
    ID: number,
    name: string,
    description: string,
    episode: string
}

type videoProps = {
    content: Videos
}

const videos: React.FC<videoProps> = ({ content }) => {
    const { ID, name, description, episode } = content        
    

    return (
        <>
            {content ? <div className = "video-block">
                <h2>{name}</h2>
                <p>{description}</p>
            </div> : null}
        </>
    )
}

export default videos