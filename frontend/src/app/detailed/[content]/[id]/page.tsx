'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import styles from './page.module.css';
import Carousel from "@/components/carousel/carousel";
import HeroSpecificSection from "@/components/hero-specific/heroSpecific";
import { Footer } from "@/components/Footer/Footer";
import { NavBarNotSignedIn } from "@/components/NavBarNotSignedIn/NavBarNotSignedIn";

const Detailed = ({ params }: { params: {content: string, id: number, imageurl: string} }) => {
    const { id } = params;
    const [contentData, setContentData] = useState([]);
    const [activeTab, setActiveTab] = useState('episodes'); // Default active tab

    useEffect(() => {
      async function fetchData() {
        const res = await axios.get('http://localhost:3001/api/series/seriesSummary/');
        setContentData(res.data);
      }
      fetchData();
    }, []);

    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

    return (
      <>  
        <NavBarNotSignedIn />
        <HeroSpecificSection seriesId={parseInt(id, 10)} onTabChange={handleTabChange} />
        <div className={styles.bottomContainer}>
        <div className={`${styles.tabContent} ${activeTab === 'episodes' ? styles.active : ''}`}>
          <Carousel items={contentData} title="" />
        </div>
        <div className={`${styles.tabContent} ${activeTab === 'related' ? styles.active : ''}`}>
          <p>Related content goes here...</p>
        </div>
        <div className={`${styles.tabContent} ${activeTab === 'discussions' ? styles.active : ''}`}>
          <p>Discussions content goes here...</p>
        </div>
        <div className={`${styles.tabContent} ${activeTab === 'behindTheScenes' ? styles.active : ''}`}>
          <p>Behind the Scenes content goes here...</p>
        </div>
        <div className={`${styles.tabContent} ${activeTab === 'details' ? styles.active : ''}`}>
          <p>Details content goes here...</p>
        </div>
        </div>
        <Footer />
      </>
    )
}

export default Detailed;
