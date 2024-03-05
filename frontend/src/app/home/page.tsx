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
import BtsCarousel from '@/components/btsCarousel/btsCarousel.js'

export interface BTSSeriesSummary {
    series_id: number
    bts_series_id: number
    series_name: string
    series_status: string
    series_thumbnail: string | null
}
export interface BTSMoviesSummary {
    movie_id: number
    bts_movies_id: number
    movie_name: string
    movie_status: string
    movie_thumbnail: string | null
}

type BTSData = BTSSeriesSummary & BTSMoviesSummary;


export default function Test() {
    const [seriesData, setSeriesData] = useState([]);
    const [movieData, setMovieData] = useState([]);
    const [BTSData, setBTSData] = useState<BTSData | []>([]);

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
        async function fetchSeries() {
            const seriesRes = await axios.get('http://localhost:3001/api/series/seriesSummary/');
            // Transform series data to include a 'type' property
            const transformedSeriesData = seriesRes.data.map((item:any) => ({
                ...item,
                type: 'series',
                id: item.series_id,
                imageUrl: item.series_thumbnail,
                title: item.series_name
            }));
            const token = localStorage.getItem('token'); 
            setIsUserSignedIn(!!token);
            setSeriesData(transformedSeriesData);
        }
        
        async function fetchMovies() {
            const moviesRes = await axios.get('http://localhost:3001/api/movies/movieSummary');
            const transformedMovieData = moviesRes.data.map((item:any) => ({
                ...item,
                type: 'movies', 
                id: item.movie_id,
                imageUrl: item.movie_thumbnail,
                title: item.movie_name
            }));
            setMovieData(transformedMovieData);
        }

        async function fetchBTS() {
            const btsRes = await axios.get('http://localhost:3001/api/bts/summaryBTSall');
            const allBTSData = [...btsRes.data.pre, ...btsRes.data.prod, ...btsRes.data.post].map(item => {
                const isSeries = item.hasOwnProperty('series_id');
                return {
                    ...item,
                    type: isSeries ? 'series' : 'movies', 
                    id: isSeries ? item.series_id : item.movie_id,
                    imageUrl: isSeries ? item.series_thumbnail : item.movie_thumbnail,
                    title: isSeries ? item.series_name : item.movie_name
                };
            });
            console.log(btsRes.data);
            
            // setBTSData(allBTSData);
            
        }
        

        async function fetchPodcast() {
            const podcastRes = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
            // const podcastRes = await axios.get(`/api/podcasts/podcastSummary`, {withCredentials: true})
            const transformedPodcastData = podcastRes.data.map((item:any) => ({
                ...item,
                type: 'podcast',
                id: item.podcast_id,
                imageUrl: item.podcast_thumbnail,
                title: item.podcast_name
            }));
            setPodcastData(transformedPodcastData);
        }
        fetchPodcast();
        fetchSeries();
        fetchMovies();
        fetchBTS()
    }, []);

    return (
        <>
            {isUserSignedIn ? <NavBarSignedIn /> : <NavBarNotSignedIn />}
            <main className={styles.carouselBody}>
                <HeroSection />
                <div>
                    <Carousel items={seriesData} title="Series " />
                </div>
                <div>
                    <MovieCarousel items={movieData} title="Movies " />
                </div>
                  <div>
                  <PodcastCarousel items={podcastData} title="Podcasts " />
                </div>
                <div>
                    <BtsCarousel items={BTSData} title="Behind The Scenes " />
                </div>
            </main>
            <Footer />
        </>
    );
}
