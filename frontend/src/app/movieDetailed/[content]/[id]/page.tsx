'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import styles from './page.module.css';
import MovieCarousel from "@/components/movieCarousel/movieCarousel";
import HeroSpecificMovie from "@/components/heroSpecificMovie/heroSpecificMovie";
import { Footer } from "@/components/Footer/Footer";
import { NavBarNotSignedIn } from "@/components/NavBarNotSignedIn/NavBarNotSignedIn";
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn.js';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import MovieCommentsSection from "@/components/movieComments/movieComments";
import MovieDetails from '@/components/movieDetails/movieDetails';
 
const MovieDetailed = ({ params }: { params: { content: string, id: number, imageurl: string } }) => {
  const { id } = params;
  const [contentData, setContentData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('episodes');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);


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
  async function fetchMovieDetails() {
    try {
      const response = await axios.get('http://localhost:3001/api/movies/movieSummary/');
      const movie = response.data.find(p => p.movie_id === parseInt(id, 10));
      if (movie) {
        setMovieDetails(movie);
      } else {
        console.error('movie not found');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }
  const token = localStorage.getItem('token'); 
  setIsUserSignedIn(!!token);
  fetchMovieDetails();
}, [id]);


  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3001/api/movies/movieSummary/');
      setContentData(res.data);
      console.log(res.data)
    }
    // const token = localStorage.getItem('token'); 
    // setIsUserSignedIn(!!token);
    fetchData();
    
  }, []);



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

    return (
      <>  
            {isUserSignedIn ? <NavBarSignedIn /> : <NavBarNotSignedIn />}
        <HeroSpecificMovie movieId={parseInt(id, 10)} onTabChange={handleTabChange} activeTab={activeTab} />
        <div >
          <div className={`${styles.tabContent} ${activeTab === 'episodes' ? styles.active : ''}`}>
            <MovieCarousel items={contentData} title="" />
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'related' ? styles.active : ''}`}>
          <MovieCarousel items={contentData} title="" />

          </div>
          <div className={`${styles.tabContent} ${activeTab === 'discussions' ? styles.active : ''}`}>
          <MovieCommentsSection contentId={id} />
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'behindTheScenes' ? styles.active : ''}`}>
            <p>Behind the Scenes content coming soon!</p>
          </div>
          <div className={`${styles.tabContent} ${activeTab === 'details' ? styles.active : ''}`}>
          <MovieDetails details={movieDetails} />
          </div>
          <div className={`${styles.tabContent} bottomContainer ${activeTab === 'discussions' ? styles.active : ''}`}>
</div>

        </div>
        <Footer />
      </>
    )
}

export default MovieDetailed;
