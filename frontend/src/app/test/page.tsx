'use client';


import React from 'react';
import Carousel from '../../components/carousel/carousel.js';
import { Footer } from '@/components/Footer/Footer.js';
import styles from './page.module.css';
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn.js';
import HeroSection from '../../components/hero/herosection.js'
import PlayNowButton from '../../components/PlayNow/PlayNow.js'

const originalContent = [
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail2.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail3.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail4.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail5.png",
  },  
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail2.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail3.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail4.png",
  },
  {
    id: 1,
    imageUrl: "/assets/MovieThumbnail5.png",
  },  
];
export default function Test() {
  return (
    <> 
  <NavBarNotSignedIn />
  <main className={styles.carouselBody}>   
  <HeroSection />
    <div>
    <Carousel items={originalContent} title="Original Content " />
    </div>
    <div>
    <Carousel items={originalContent} title="Continue Watching" />
    </div>
    <div>
    <Carousel items={originalContent} title="Trending Now" />
    </div>
    <div className={styles.lastCarousel}>
    <Carousel items={originalContent} title="Behind The Scenes" />
    </div>
    <div>
    </div>
    </main>
    <Footer />

    </>
  );
};

