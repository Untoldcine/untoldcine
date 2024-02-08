import React from "react";
import styles from './page.module.css';

const Detailed = ({ params }: { params: {content: string, id: number, imageurl: string} }) => {
    const { content, id, imageurl } =  params
    console.log("content:", content);
    console.log("seriesID:", id);
    console.log("imageurl:", imageurl);

    return (
        <div className={styles.text}> {content} </div>
    
    )
}

export default Detailed


/*

import axios from 'axios';
import React from 'react';

type LoaderParams = {
  params: {
    id: string; 
  };
};

type SeriesDetails = {
  series_name: string;
  series_thumbnail: string;
};

export async function loader({ params }: LoaderParams) {
  const { id } = params;
  const response = await axios.get(`http://localhost:3001/api/series/${id}`);
  return response.data;
}

type DetailedPageProps = {
  data: SeriesDetails; 
};

export default function DetailedPage({ data }: DetailedPageProps) {
  const seriesDetails = data;

  return (
    <div>
      <h1>{seriesDetails.series_name}</h1>
      <img src={seriesDetails.series_thumbnail} alt={seriesDetails.series_name} />
    </div>
  );
}

*/