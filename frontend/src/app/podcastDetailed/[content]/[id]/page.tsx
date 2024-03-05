'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import styles from './page.module.css';
import PodcastCarousel from "@/components/podcastCarousel/podcastCarousel";
import HeroSpecificPodcast from "@/components/heroSpecificPodcast/heroSpecificPodcast";
import { Footer } from "@/components/Footer/Footer";
import { NavBarNotSignedIn } from "@/components/NavBarNotSignedIn/NavBarNotSignedIn";
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn.js';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PodcastCommentsSection from "@/components/podcastComments/podcastComments";
import PodcastDetails from '@/components/podcastDetails/podcastDetails';

const PodcastDetailed = ({ params }: { params: { content: string, id: number, imageurl: string } }) => {
  const { id } = params;
  const [contentData, setContentData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('episodes');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [podcastDetails, setPodcastDetails] = useState(null);


  //TO DO: add logic for looking for token from cookies. 

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
  async function fetchPodcastDetails() {
    try {
      const response = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
      const podcast = response.data.find((p:any) => p.podcast_id === parseInt(String(id), 10));
      if (podcast) {
        setPodcastDetails(podcast);
      } else {
        console.error('Podcast not found');
      }
    } catch (error) {
      console.error('Error fetching podcast details:', error);
    }
  }
  const token = localStorage.getItem('token'); 
  setIsUserSignedIn(!!token);
  fetchPodcastDetails();
}, [id]); 


  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
      setContentData(res.data);
      console.log(res.data)
    }
    const token = localStorage.getItem('token'); 
    setIsUserSignedIn(!!token);
    fetchData();
    
  }, []);



  const handleTabChange = (tab: string | number) => {
    setActiveTab(String(tab)); 
};

    return (
      <>  
            {isUserSignedIn ? <NavBarSignedIn /> : <NavBarNotSignedIn />}
        <HeroSpecificPodcast podcastId={id} onTabChange={handleTabChange} activeTab={activeTab} />
        <div >
          <div className={`${styles.tabContent} ${activeTab === 'episodes' ? styles.active : ''}`}>
            <PodcastCarousel items={contentData} title="" />
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'related' ? styles.active : ''}`}>
          <PodcastCarousel items={contentData} title="" />

          </div>
          <div className={`${styles.tabContent} ${activeTab === 'discussions' ? styles.active : ''}`}>
          <PodcastCommentsSection contentId={id} />
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'behindTheScenes' ? styles.active : ''}`}>
            <p>Behind the Scenes content coming soon!</p>
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'details' ? styles.active : ''}`}>
          <PodcastDetails details={podcastDetails} />
          </div>
          <div className={`${styles.tabContent} bottomContainer ${activeTab === 'discussions' ? styles.active : ''}`}>
</div>

        </div>
        <Footer />
      </>
    )
}

export default PodcastDetailed;
