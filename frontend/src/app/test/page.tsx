'use client';

import React, { useEffect, useState } from 'react';
import Carousel from '../../components/carousel/carousel.js';
import { Footer } from '@/components/Footer/Footer.js';
import styles from './page.module.css';
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn.js';
import HeroSection from '../../components/hero/herosection.js';
import axios from 'axios';

export default function Test() {
    const [seriesData, setSeriesData] = useState([]);
    const [movieData, setMovieData] = useState([]);

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

        fetchSeries();
        fetchMovies();
    }, []);

    return (
        <>
            <NavBarNotSignedIn />
            <main className={styles.carouselBody}>
                <HeroSection />
                <div>
                    <Carousel items={seriesData} title="Original Content " />
                </div>
                <div>
                    <Carousel items={movieData} title="Movies " />
                </div>
                  <div>
                    <Carousel items={[]} title="Podcasts " />
                </div>
                <div>
                    <Carousel items={[]} title="Behind The Scenes " />
                </div>
            </main>
            <Footer />
        </>
    );
}
