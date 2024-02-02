import React, { useState } from 'react';
import Card from '../card/card'; 
import styles from './carousel.module.css'; 

const Carousel = ({ items, title }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 6; 
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
            onClick={scrollLeft}
          >
            &lt;
          </button>
        )}
        {items.slice(startIndex, startIndex + itemsToShow).map(item => (
          <Card key={item.id} {...item} />
        ))}
        {startIndex < items.length - itemsToShow && (
          <button
            className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
            onClick={scrollRight}
            style={{ position: 'absolute', right: '0', zIndex: 2 }}
          >
            &gt;
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default Carousel;