'use client'
import { useEffect, useState } from "react";
import axios from 'axios'; 
import React from "react";
import styles from './page.module.css';
import Carousel from "@/components/carousel/carousel";
import HeroSpecificSection from "@/components/hero-specific/heroSpecific";
import { Footer } from "@/components/Footer/Footer";
import { NavBar } from "@/components/NavBar/NavBar";
import SeriesDetails from "@/components/seriesDetails/seriesDeatils"
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faUser } from '@fortawesome/free-solid-svg-icons';
import Comments from "@/components/comments/comments";

const Detailed = ({ params }: { params: { content: string, id: number, imageurl: string } }) => {
  const { id } = params; 
  const [contentData, setContentData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('episodes');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [seriesDetails, setSeriesDetails] = useState(null);

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
    async function fetchSeriesDetails() {
      try {
        const response = await axios.get('http://localhost:3001/api/series/seriesSummary/');
        const series = response.data.find((s: any) => s.series_id === parseInt(String(id), 10));
        if (series) {
          setSeriesDetails(series);
        } else {
          console.error('Series not found');
        }
      } catch (error) {
        console.error('Error fetching series details:', error);
      }
    }

    const token = localStorage.getItem('token');
    setIsUserSignedIn(!!token);
    fetchSeriesDetails();
  }, [id]);

  const handleTabChange = (tab: string | number) => {
    setActiveTab(String(tab)); 
};
;
    return (
      <>  
        <NavBar />
        <HeroSpecificSection seriesId={id} onTabChange={handleTabChange} activeTab={activeTab} />
        <div >
          <div className={`${styles.tabContent} ${activeTab === 'episodes' ? styles.active : ''}`}>
            <Carousel items={contentData} title="" />
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'related' ? styles.active : ''}`}>
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'discussions' ? styles.active : ''}`}>
          <Comments contentId={id} />
        </div>
        <div className={`${styles.tabContent} ${activeTab === 'behindTheScenes' ? styles.active : ''}`}>
          <p>Behind the Scenes content goes here...</p>
        </div>
        <div className={`${styles.tabContent} ${activeTab === 'details' ? styles.active : ''}`}>
          <SeriesDetails details={seriesDetails} />
        </div>
        <div className={`${styles.tabContent} bottomContainer ${activeTab === 'discussions' ? styles.active : ''}`}>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Detailed;
