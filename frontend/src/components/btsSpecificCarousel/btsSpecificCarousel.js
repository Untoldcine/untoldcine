import React, { useState } from 'react';
import BtsCard from '../btsCard/btsCard'; 
import styles from './btsSpecificCarousel.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const BtsSpecificCarousel = ({ data }) => {
  const [startIndexPre, setStartIndexPre] = useState(0);
  const [startIndexProd, setStartIndexProd] = useState(0);
  const [startIndexPost, setStartIndexPost] = useState(0);
  const itemsToShow = 8; 

  const getThumbnailUrl = (item) => item.series_thumbnail || item.movie_thumbnail;
  const getTitle = (item) => item.series_name || item.movie_name;
  const getId = (item) => item.series_id || item.movie_id;
  const getContentType = (item) => item.series_id ? 'series' : 'movie'; 

  const renderCarousel = (items, title, startIndex, setStartIndex) => (
    <div className={styles.carouselContainer}>
      <h4 className={styles.carouselTitle}>{title}</h4>
      <div className={styles.carouselInner}>
        {startIndex > 0 && (
          <button
            className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
            onClick={() => setStartIndex(startIndex - 1)}>
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
            onClick={() => setStartIndex(startIndex + 1)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {renderCarousel(data.pre, "Pre-Production", startIndexPre, setStartIndexPre)}
      {renderCarousel(data.prod, "Production", startIndexProd, setStartIndexProd)}
      {renderCarousel(data.post, "Post-Production", startIndexPost, setStartIndexPost)}
    </>
  );
};


export default BtsSpecificCarousel;
