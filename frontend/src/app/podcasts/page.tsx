'use client';

import React, { useEffect, useState } from 'react';
import Carousel from '../../components/carousel/carousel.js';
import { Footer } from '@/components/Footer/Footer.js';
import styles from './page.module.css';
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn.js';
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn.js';
import HeroSection from '../../components/hero/herosection.js';
import axios from 'axios';
import PodcastCarousel from "@/components/podcastCarousel/podcastCarousel"
import MovieCarousel from '@/components/movieCarousel/movieCarousel.js';
export default function Test() {
    const [seriesData, setSeriesData] = useState([]);
    const [movieData, setMovieData] = useState([]);
    const [podcastData, setPodcastData] = useState([])
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            setIsUserSignedIn(!!token);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    useEffect(() => {
  async function fetchPodcast() {
            const podcastRes = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
            const transformedPodcastData = podcastRes.data.map((item:any) => ({
                ...item,
                type: 'podcast',
                id: item.podcast_id,
                imageUrl: item.podcast_thumbnail,
                title: item.podcast_name
            }));
            const token = localStorage.getItem('token'); 
            setIsUserSignedIn(!!token);
            setPodcastData(transformedPodcastData);
        }
        fetchPodcast();
    }, []);

    return (
        <>
            {isUserSignedIn ? <NavBarSignedIn /> : <NavBarNotSignedIn />}
            <main className={styles.carouselBody}>
                <HeroSection />
                  <div className={styles.podcastCarousel}>
                  <PodcastCarousel items={podcastData} title="Podcasts " />
                </div>
            </main>
            <Footer />
        </>
    );
}
