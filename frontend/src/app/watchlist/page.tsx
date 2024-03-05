'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import WatchlistCard from '@/components/watchlistCard/watchlistCard';
import styles from './page.module.css'; 
import { NavBarNotSignedIn } from '@/components/NavBarNotSignedIn/NavBarNotSignedIn';
import { NavBarSignedIn } from '@/components/NavBarSignedIn/NavBarSignedIn';

interface WatchlistProps {
  userId: number
}

const Watchlist:React.FC<WatchlistProps> = ({ userId }) => {
  const [watchlist, setWatchlist] = useState([]);
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




//   async function getWatchlistWithThumbnails(userId:number) {
//     const watchlistItems = await prisma.watchlist.findMany({
//         where: { user_id: userId },
//     });

//     const watchlistWithThumbnails = await Promise.all(watchlistItems.map(async (item) => {
//         let thumbnailUrl = '';
//         switch (item.content_type) {
//             case 'PODCAST':
//                 const podcast = await prisma.series.findUnique({ where: { id: item.content_id } });
//                 thumbnailUrl = podcast.thumbnail;
//                 break;
//             case 'MOVIE':
//                 const movie = await prisma.movie.findUnique({ where: { id: item.content_id } });
//                 thumbnailUrl = movie.thumbnail;
//                 break;
//         }
//         return {
//             ...item,
//             thumbnailUrl,
//         };
//     }));

//     return watchlistWithThumbnails;
// }


  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const response = await axios.get('http://localhost:3001/api/watchlist/getList', { withCredentials: true });
        if (response.status === 200) {
          setWatchlist(response.data.dateOrder); 
        }
      } catch (error) {
        console.error('Failed to fetch watchlist:', error);
      }
    }
    
    fetchWatchlist();
  }, [userId]); 

  // const removeFromWatchlist = async (itemId:number) => {
  //   try {
  //     const response = await axios.post('http://localhost:3001/api/watchlist/remove', {
  //       content_id: itemId,
  //     }, { withCredentials: true });

  //     if (response.status === 200) {
  //       setWatchlist(watchlist.filter(item => item.id !== itemId));
  //     }
  //   } catch (error) {
  //     console.error('Failed to remove item from watchlist:', error);
  //   }
  // };
 
  return (
    <>
                {/* {isUserSignedIn ? <NavBarSignedIn /> : <NavBarNotSignedIn />}

    <div className={styles.watchlist}>
      {watchlist.length > 0 ? watchlist.map(item => (
        <WatchlistCard key={item.id} item={item} onRemoveFromWatchlist={removeFromWatchlist} />
      )) : (
        <p className={styles.noWatchlistItems}>Your watchlist is empty.</p>
      )}
    </div> */}
    </>
  );
};

export default Watchlist;
