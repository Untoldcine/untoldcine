'use client'
import { useEffect, useState } from "react";
import axios from 'axios'
import React from "react";
import styles from './page.module.css';
import HeroSection from "@/components/hero/herosection";
import Carousel from "@/components/carousel/carousel";
import HeroSpecificSection from "@/components/hero-specific/heroSpecific";
import { Footer } from "@/components/Footer/Footer";
import { NavBarNotSignedIn } from "@/components/NavBarNotSignedIn/NavBarNotSignedIn";

const Detailed = ({ params }: { params: {content: string, id: number, imageurl: string} }) => {
    const { content, id, imageurl } =  params
    const [contentData, setContentData] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const res = await axios.get('http://localhost:3001/api/series/seriesSummary/');
        setContentData(res.data);
        console.log(res.data);
      }
      fetchData();
    }, []);
    
    // console.log("content:", content);
    // console.log("seriesID:", id);
    // console.log("imageurl:", imageurl);

    return (
      <> 
      <NavBarNotSignedIn />
      <HeroSpecificSection seriesId={parseInt(id, 10)} />
        <div className={styles.carouselContainer}>
          <Carousel items={contentData} title=" " />
        </div>
        <div>
          <Footer />
        </div>

        <div className={styles.text}> {content} </div>
      </>
    
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