

import React, { useState } from 'react';
import PodcastCard from '../podcastCard/podcastCard'; 
import styles from './podcastCarousel.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
 

const PodcastCarousel = ({ items, title }) => {
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
          <PodcastCard
            key={item.podcast_id} 
            imageUrl={item.podcast_thumbnail}
            title={item.podcast_name}
            podcastId={item.podcast_id}
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

export default PodcastCarousel;
