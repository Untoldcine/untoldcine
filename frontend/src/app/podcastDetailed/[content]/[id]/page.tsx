'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import styles from './page.module.css';
import Carousel from "@/components/carousel/carousel";
import HeroSpecificPodcast from "@/components/heroSpecificPodcast/heroSpecificPodcast";
import { Footer } from "@/components/Footer/Footer";
import { NavBarNotSignedIn } from "@/components/NavBarNotSignedIn/NavBarNotSignedIn";
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Comments from "@/components/comments/comments";

const PodcastDetailed = ({ params }: { params: { content: string, id: number, imageurl: string } }) => {
  const { id } = params;
  const [contentData, setContentData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('episodes');
  const [replyToCommentId, setReplyToCommentId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3001/api/podcast/podcastSummary/');
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
        <HeroSpecificPodcast podcastId={parseInt(id, 10)} onTabChange={handleTabChange} activeTab={activeTab} />
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
            <p>Details content goes here...</p>
          </div>
          <div className={`${styles.tabContent} bottomContainer ${activeTab === 'discussions' ? styles.active : ''}`}>
</div>

        </div>
        <Footer />
      </>
    )
}

export default PodcastDetailed;
