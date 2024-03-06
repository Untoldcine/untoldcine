'use client'
import React, { useState, useEffect } from 'react';
import styles from './MainCarousel.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {getSeriesData, getMovieData, getPodcastData, getBTSData} from "./CarouselFunc"
import CarouselCard from "../CarouselCard/CarouselCard"


type CarouselProps = {
  type: string,
  title: string
}

const MainCarousel:React.FC<CarouselProps> = ({type, title}) => {
  const CarouselCardMemo = React.memo(CarouselCard);

  const [carouselData, setCarouselData] = useState([])
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 8; 
  const scrollLeft = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const scrollRight = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 1, carouselData.length - itemsToShow));
  };

  useEffect(() => {
    const main = async () => {
      if (type === 'series') {
        const data = await getSeriesData();
        setCarouselData(data);
      }
      if (type === 'movies') {
        const data = await getMovieData();
        setCarouselData(data);
      }
      if (type === 'podcasts') {
        const data = await getPodcastData();
        setCarouselData(data);
      }
      if (type === 'bts') {
        const data = await getBTSData();
        setCarouselData(data);
      }
    };
    main();
  }, [type]);
 

  return (
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
        {carouselData.length > 0 && carouselData.slice(startIndex, startIndex + itemsToShow).map((item, index) => (
          <CarouselCardMemo key = {type + index} type = {type} content = {item}/>
        ))}
        {startIndex < carouselData.length - itemsToShow && (
          <button
          className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
          onClick={scrollRight}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        )}
        </div>
    </div>
  )
}

export default MainCarousel