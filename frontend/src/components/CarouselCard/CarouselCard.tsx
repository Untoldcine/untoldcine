import React from 'react';
import styles from './CarouselCard.module.css'; 
import Link from "next/link";
import {SeriesSummary, MovieSummary, PodcastSummary, BTSSeriesSummary, BTSMoviesSummary} from "@/app/interfaces"

type Content = SeriesSummary | MovieSummary | PodcastSummary | BTSSeriesSummary | BTSMoviesSummary

type BTSAllSummary = BTSSeriesSummary & BTSMoviesSummary

interface CardProps {
  type: string
  content: Content;
}


const Card:React.FC<CardProps> = ({ type, content }) => {

     function isSeries(content: Content): content is SeriesSummary {
        return type === 'series';
     }
      function isMovie(content: Content): content is MovieSummary {
        return type === 'movies';
      }
      function isPodcast(content: Content): content is PodcastSummary {
        return type === 'podcasts';
      }
      function isBTS(content: Content): content is BTSAllSummary {
        return type === 'bts';
      }

      if (isSeries(content)) {
        // console.log(content);
        const { series_id, series_name, series_thumbnail, genres, series_length, reviewed } = content        
    
        return (
          <Link href = {`/detailed/series/${series_id}`}>
          <div className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.card}>
                    <img src={series_thumbnail} alt={series_name} className={styles.cardImage} />
                </div>
                </div>
            </div>
          </Link>
        )
      }
      if (isMovie(content)) {
        // console.log(content);
        const {movie_id, movie_name, movie_thumbnail, genres, movie_length, reviewed} = content
    
        return (
            <Link href = {`/detailed/movies/${movie_id}`}>
            <div className={styles.cardLink}>
              <div className={styles.card}>
                  <div className={styles.card}>
                      <img src={movie_thumbnail} alt={movie_name} className={styles.cardImage} />
                  </div>
                  </div>
              </div>
            </Link>
        )
      }
      if (isPodcast(content)) {
        // console.log(content);
        const {podcast_id, podcast_name, podcast_thumbnail, podcast_status, reviewed} = content
    
        return (
            <Link href = {`/detailed/podcasts/${podcast_id}`}>
            <div className={styles.cardLink}>
              <div className={styles.card}>
                  <div className={styles.card}>
                      <img src={podcast_thumbnail} alt={podcast_name} className={styles.cardImage} />
                  </div>
                  </div>
              </div>
            </Link>
        )
      }
    //   if (isBTS(content)) {
    //     console.log(content);
    
    //     return (
    //         <Link href = ''>
    //         <div className={styles.cardLink}>
    //           <div className={styles.card}>
    //               <div className={styles.card}>
    //                   {/* <img src={podcast_thumbnail} alt={podcast_name} className={styles.cardImage} /> */}
    //               </div>
    //               </div>
    //           </div>
    //         </Link>
    //     )
    //   }

    // const seriesPageUrl = `/detailed/${title}/${seriesId}`;
  };
  
  export default Card;