'use client'
import axios from 'axios';
import { useState } from 'react';

type Podcast = {
    podcast_id: number;
    podcast_name: string;
    podcast_status: string;
    podcast_thumbnail: string | null;
    podcast_url: string | null;
    reviewed: boolean;
    country_name: string;
    podcast_signed: string
};

const Page = () => {
    const [dataLoaded, setDataLoaded] = useState<Podcast | null>(null);

    const getSpecificContent = async (content: string, id: number) => {
        try {
            // const res = await axios.get(`http://localhost:3001/api/${content}/specific/${id}`);
            const res = await axios.get(`/api/${content}/specific/${id}}`)
            setDataLoaded(res.data); 
            // console.log(res.data);
            
        } catch (err) {
            console.error('Error attempting to GET detailed content data');
        }
    };

    return (
        <div>
            <button onClick={() => getSpecificContent('podcast', 5)}>Get first podcast ep</button>
            {dataLoaded && dataLoaded.podcast_signed ? (
                <video controls style = {{width: '100%'}}>
                    <source src={dataLoaded.podcast_signed} type="video/mp4"/>
                </video>
            ) : null}
        </div>
    );
};

export default Page;
