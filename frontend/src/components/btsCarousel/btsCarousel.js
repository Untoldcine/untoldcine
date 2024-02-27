import React, { useState } from 'react';
import BtsCard from '../btsCard/btsCard'; 
import styles from './btsCarousel.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const BtsCarousel = ({ items, title }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 8; 
  const getContentType = (item) => item.series_id ? 'series' : 'movie'; 

  const scrollLeft = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const scrollRight = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 1, items.length - itemsToShow));
  };

  const getThumbnailUrl = (item) => {
    return item.series_thumbnail || item.movie_thumbnail;
  };

  const getTitle = (item) => {
    return item.series_name || item.movie_name;
  };

  const getId = (item) => {
    return item.series_id || item.movie_id;
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
            <BtsCard
              key={getId(item)} 
              imageUrl={getThumbnailUrl(item)}
              title={getTitle(item)}
              btsId={getId(item)}
              contentType={getContentType(item)} 

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

export default BtsCarousel;
