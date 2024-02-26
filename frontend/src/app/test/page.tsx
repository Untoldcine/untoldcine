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
        async function fetchSeries() {
            const seriesRes = await axios.get('http://localhost:3001/api/series/seriesSummary/');
            // Transform series data to include a 'type' property
            const transformedSeriesData = seriesRes.data.map(item => ({
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
            const transformedMovieData = moviesRes.data.map(item => ({
                ...item,
                type: 'movies', 
                id: item.movie_id,
                imageUrl: item.movie_thumbnail,
                title: item.movie_name
            }));
            setMovieData(transformedMovieData);
        }

        async function fetchPodcast() {
            const podcastRes = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
            const transformedPodcastData = podcastRes.data.map(item => ({
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
    }, []);

    return (
        <>
            {isUserSignedIn ? <NavBarSignedIn /> : <NavBarNotSignedIn />}
            <main className={styles.carouselBody}>
                <HeroSection />
                <div>
                    <Carousel items={seriesData} title="Original Content " />
                </div>
                <div>
                    <Carousel items={movieData} title="Movies " />
                </div>
                  <div>
                  <PodcastCarousel items={podcastData} title="Podcasts " />
                </div>
                <div>
                    <Carousel items={[]} title="Behind The Scenes " />
                </div>
            </main>
            <Footer />
        </>
    );
}
