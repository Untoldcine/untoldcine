'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import styles from './page.module.css';
import Carousel from "@/components/carousel/carousel";
import HeroSpecificSection from "@/components/hero-specific/heroSpecific";
import { Footer } from "@/components/Footer/Footer";
import { NavBarNotSignedIn } from "@/components/NavBarNotSignedIn/NavBarNotSignedIn";
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Comments from "@/components/comments/comments";

const Detailed = ({ params }: { params: { content: string, id: number, imageurl: string } }) => {
  const { id } = params;
  const [contentData, setContentData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('episodes');
  const [replyToCommentId, setReplyToCommentId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3001/api/series/seriesSummary/');
      setContentData(res.data);
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   async function fetchComments() {
  //     if (activeTab === 'discussions') {
  //       try {
  //         const response = await axios.get(`http://localhost:3001/api/series/comments/${id}`);
  //         setComments(response.data);
  //       } catch (error) {
  //         console.error('Failed to fetch comments:', error);
  //         setComments([]);
  //       }
  //     }
  //   }
  //   fetchComments();
  // }, [activeTab, id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

//   const formatDate = (date) => {
//     return formatDistanceToNow(new Date(date), { addSuffix: true });
//   };

//   const postNewComment = async () => {        
//     try {
//         const res = await axios.post(`http://localhost:3001/api/comments/newComment/`, {
//             content_id: id,
//             table_name: 'series',
//             comment: newComment,
//         },
//         { withCredentials: true });
//         console.log(res.data);
//         setNewComment(''); // Reset the input field after posting
//     }
//     catch(err) {
//         console.error(err + ': Error posting new comment');
//     }
// };
  

  // const handleReplyClick = (commentId) => {
  //   setReplyToCommentId(commentId);
  // };
    return (
      <>  
        <NavBarNotSignedIn />
        <HeroSpecificSection seriesId={parseInt(id, 10)} onTabChange={handleTabChange} activeTab={activeTab} />
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
    {/* <div className={styles.newCommentForm}>
    <input
      className={styles.newCommentTextarea}
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="What are your thoughts?"
    />
    <button className={styles.newCommentButton} onClick={postNewComment}>
      Post
    </button>
  </div>

  {comments.length > 0 ? (
    comments.map((comment) => (
      <div key={comment.series_comments_id} className={styles.commentContainer}>
        <div className={styles.voteAndCommentContainer}>
          <div className={styles.voteButtonsContainer}>
            <button className={styles.voteButton}>+</button>
            <span className={styles.voteCount}>{comment.series_comments_upvotes - comment.series_comments_downvotes}</span>
            <button className={styles.voteButton}>-</button>
          </div>

          <div className={styles.commentAndFooterContainer}>
            <div className={styles.commentHeader}>
              <div className={styles.headerContainer}>
                <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
                <span className={styles.commentAuthor}>{comment.user.user_nickname}</span>
              </div>
              <p className={styles.commentDate}>{formatDate(comment.date_created)}</p>
            </div>
            <p className={styles.commentContent}>{comment.series_comments_content}</p>
            <div className={styles.commentFooter}>
              <span className={styles.replyButton} onClick={() => handleReplyClick(comment.series_comments_id)}>
                <FontAwesomeIcon icon={faReply} /> Reply
              </span>
            </div>
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.replySection}>
            {comment.replies.map((reply) => (
              <div key={reply.series_comments_id} className={styles.reply}>
                <div className={styles.voteButtonsContainer}>
                  <button className={styles.voteButton}>+</button>
                  <span className={styles.voteCount}>{reply.series_comments_upvotes - reply.series_comments_downvotes}</span>
                  <button className={styles.voteButton}>-</button>
                </div>
                <div className={styles.commentAndFooterContainer}>
                <div className={styles.commentHeader}>
              <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
              <span className={styles.commentAuthor}>{comment.user.user_nickname}</span>
              <span className={styles.commentDate}>{formatDate(comment.date_created)}</span>
            </div>
            <p className={styles.commentContent}>{comment.series_comments_content}</p>
          </div>
          <div className={styles.commentFooter}>
            <span className={styles.replyButton} onClick={() => handleReplyClick(comment.series_comments_id)}>
              <FontAwesomeIcon icon={faReply} /> Reply
            </span>
          </div>
                {replyToCommentId === reply.series_comments_id && (
                  <div className={styles.replyInputContainer}>
                    <input
                      className={styles.newCommentTextarea}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <button className={styles.newCommentButton} onClick={() => postReply(reply.series_comments_id)}>
                      Send
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {replyToCommentId === comment.series_comments_id && (
          <div className={`${styles.replyInputContainer} ${styles.replyToComment}`}>
            <input
              className={styles.newCommentTextarea}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
            />
            <button className={styles.newCommentButton} onClick={() => postReply(comment.series_comments_id)}>
              Send
            </button>
          </div>
        )}
      </div>
    ))
  ) : (
    <p className={styles.noComments}>No comments yet.</p>
  )} */}
</div>

        </div>
        <Footer />
      </>
    )
}

export default Detailed;
