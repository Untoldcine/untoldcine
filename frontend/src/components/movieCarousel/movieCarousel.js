 

import React, { useState } from 'react';
import MovieCard from '../movieCard/moiveCard'; 
import styles from './movieCarousel.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
 

const MovieCarousel = ({ items, title }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 8; 
  const scrollLeft = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const scrollRight = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 1, items.length - itemsToShow));
  };
 
  return (
    <>
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>{title}</h2>
      <div className={styles.carouselInner}>
        {startIndex > 0 && (
          <button
            className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
            onClick={scrollLeft}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
        {items.slice(startIndex, startIndex + itemsToShow).map((item) => (
          <MovieCard
            key={item.movie_id} 
            imageUrl={item.movie_thumbnail}
            title={item.movie_name}
            movieId={item.movie_id}
          />
        ))}


        {startIndex < items.length - itemsToShow && (
          <button
          className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
          onClick={scrollRight}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        )}
      </div>
    </div>
    </>
  );
};

export default MovieCarousel;
