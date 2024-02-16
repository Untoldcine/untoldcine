'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Carousel from '../../components/carousel/carousel'; 
import HeroSpecificSection from '../../components/hero-specific/heroSpecific'; 
import { Footer } from '@/components/Footer/Footer'; 
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn'; 
import styles from './page.module.css'; 


interface SeriesInfo {
  ID: number; 
  series_name: string;
  series_type: string;
  rating: string;
  genres: string[]; 
  seasons: number;
  episodes: number;
  length: string; 
  description: string;
  status: string;
  created: string; 
}

interface Video {
  ID: number; 
  name: string;
  episode: number;
  description: string;
}

export default function SeriesSpecificPage() {
  console.log("SeriesSpecificPage is being rendered");

  const router = useRouter();
  const { seriesId } = router.query;
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (seriesId) {
      axios.get(`http://localhost:3001/api/series/series-specific/${seriesId}`)
.then(res => {
  setSeriesInfo(res.data); 
  setVideos(res.data.videos); 
})
        .catch(error => console.log(error));
    }
  }, [seriesId]);
  

  if (!seriesInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>  
      <NavBarNotSignedIn />
      <main className={styles.carouselBody}>
        <HeroSpecificSection seriesThumbnail={seriesInfo.series_thumbnail} />
        <div>
          <h1>{seriesInfo?.series_name}</h1>
        </div>
        <div>
          {videos.map(video => ( 
            <div key={video.ID}>
              <h2>{video.name}</h2>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
