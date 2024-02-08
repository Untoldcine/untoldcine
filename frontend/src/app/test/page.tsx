'use client';


import React, { useEffect, useState } from 'react';
import Carousel from '../../components/carousel/carousel.js';
import { Footer } from '@/components/Footer/Footer.js';
import styles from './page.module.css';
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn.js';
import HeroSection from '../../components/hero/herosection.js'
import PlayNowButton from '../../components/PlayNow/PlayNow.js'
import axios from 'axios';


export default function Test() {
  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3001/api/series/seriesSummary/');
      setContentData(res.data);
      console.log(res.data);
    }
    fetchData();
  }, []);
  
  return (
    <> 
  <NavBarNotSignedIn />
  <main className={styles.carouselBody}>   
  <HeroSection />
         <div>
          <Carousel items={contentData} title="Original Content " />
        </div>
        <div>
          <Carousel items={contentData} title="Movies " />
        </div>
        <div>
          <Carousel items={contentData} title="Podcasts " />
        </div>
        <div>
          <Carousel items={contentData} title="Behind The Scenes " />
        </div>
    {/* <div>
    <Carousel items={originalContent} title="Continue Watching" />
    </div> 
    <div>
    <Carousel items={originalContent} title="Trending Now" />
    </div>
    <div className={styles.lastCarousel}>
    <Carousel items={originalContent} title="Behind The Scenes" />
    </div> */}
    <div>
    </div>
    </main>
    <Footer />

    </>
  );
};

