'use client';

import React, { useEffect, useState } from 'react';
import { Footer } from '@/components/Footer/Footer.js';
import styles from './page.module.css';
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn.js';
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn.js';
import HeroSection from '../../components/hero/herosection.js';
import axios from 'axios';
import BtsSpecificCarousel from "@/components/btsSpecificCarousel/btsSpecificCarousel";
import MovieCarousel from '@/components/movieCarousel/movieCarousel.js';

export default function BTS() {
    const [btsData, setBtsData] = useState({ pre: [], prod: [], post: [] });
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            setIsUserSignedIn(!!token);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    useEffect(() => {
        async function fetchBtsData() {
            const btsRes = await axios.get('http://localhost:3001/api/bts/summaryBTSAll');
            setBtsData(btsRes.data);
        }
        const token = localStorage.getItem('token'); 
        setIsUserSignedIn(!!token);
        fetchBtsData();
    }, []); 

    return (
        <>
            {isUserSignedIn ? <NavBarSignedIn /> : <NavBarNotSignedIn />}
            <main className={styles.carouselBody}>
                <HeroSection />
                <div className={styles.btsCarousel}>
                  <BtsSpecificCarousel data={btsData} />
                </div>
            </main>
            <Footer />
        </>
    );
}
