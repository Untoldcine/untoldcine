
import { Footer } from '@/components/Footer/Footer.js';
import styles from './page.module.css';
import {NavBar} from "@/components/NavBar/NavBar"
import HeroSection from '../../components/hero/herosection.js';
import axios from 'axios';
import MainCarousel from "@/components/MainCarousel/MainCarousel"
import { SeriesSummary, MovieSummary, PodcastSummary, BTSSeriesSummary, BTSMoviesSummary } from '@/app/interfaces.jsx';

export default function Home() {
   

    // useEffect(() => {
    //     async function fetchSeries() {
    //         const seriesRes = await axios.get('http://localhost:3001/api/series/seriesSummary/');
    //         // const seriesRes = await axios.get('/api/series/seriesSummary')
    //         const transformedSeriesData = seriesRes.data.map((item:any) => ({
    //             ...item,
    //             type: 'series',
    //             id: item.series_id,
    //             imageUrl: item.series_thumbnail,
    //             title: item.series_name
    //         }));
    //         setSeriesData(transformedSeriesData);
    //     }
        
    //     async function fetchMovies() {
    //         const moviesRes = await axios.get('http://localhost:3001/api/movies/movieSummary');
    //         // const moviesRes = await axios.get('/api/movies/movieSummary')
    //         const transformedMovieData = moviesRes.data.map((item:any) => ({
    //             ...item,
    //             type: 'movies', 
    //             id: item.movie_id,
    //             imageUrl: item.movie_thumbnail,
    //             title: item.movie_name
    //         }));
    //         setMovieData(transformedMovieData);
    //     }

    //     async function fetchBTS() {
    //         const btsRes = await axios.get('http://localhost:3001/api/bts/summaryBTSall');
    //         const allBTSData = [...btsRes.data.pre, ...btsRes.data.prod, ...btsRes.data.post].map(item => {
    //             const isSeries = item.hasOwnProperty('series_id');
    //             return {
    //                 ...item,
    //                 type: isSeries ? 'series' : 'movies', 
    //                 id: isSeries ? item.series_id : item.movie_id,
    //                 imageUrl: isSeries ? item.series_thumbnail : item.movie_thumbnail,
    //                 title: isSeries ? item.series_name : item.movie_name
    //             };
    //         });
    //         // console.log(btsRes.data);
            
    //         // setBTSData(allBTSData);
            
    //     }
        

    //     async function fetchPodcast() {
    //         const podcastRes = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
    //         // const podcastRes = await axios.get(`/api/podcasts/podcastSummary`, {withCredentials: true})
    //         const transformedPodcastData = podcastRes.data.map((item:any) => ({
    //             ...item,
    //             type: 'podcast',
    //             id: item.podcast_id,
    //             imageUrl: item.podcast_thumbnail,
    //             title: item.podcast_name
    //         }));
    //         setPodcastData(transformedPodcastData);
    //     }
    //     fetchPodcast();
    //     fetchSeries();
    //     fetchMovies();
    //     fetchBTS()
    // }, []);

    return (
        <>
            <NavBar/>
            <main className={styles.carouselBody}>
                <HeroSection />
                <MainCarousel type = 'series' title = "Original Content"/>
                <MainCarousel type = 'movies' title = "Movies"/>
                <MainCarousel type = 'podcasts' title = "Podcasts"/>
                <MainCarousel type = 'bts' title = "Behind The Scenes"/>
            </main>
            <Footer />
        </>
    );
}
