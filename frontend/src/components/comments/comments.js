'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from '../comments/comments.module.css'; 

const CommentsSection = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [visibleComments, setVisibleComments] = useState(5); 
  const [repliesVisibility, setRepliesVisibility] = useState({});

  const handleLoadMoreReplies = (commentId) => {
    // Initialize currentReplies to an empty array if it doesn't exist
    const currentReplies = repliesVisibility[commentId] || [];
    const offset = currentReplies.length;
    const limit = 2; // Number of replies to load each time
  
    axios.get(`http://localhost:3001/api/series/replies`, {
      params: { commentId, offset, limit }
    })
    .then(response => {
      // Update the repliesVisibility state with the new replies
      setRepliesVisibility(prevState => ({
        ...prevState,
        [commentId]: [...currentReplies, ...response.data]
      }));
    })
    .catch(error => {
      console.error('Error loading more replies:', error);
    });
  };
  


  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await axios.get(`http://localhost:3001/api/series/comments/${contentId}`);
        const commentsData = response.data;
        
        // Initialize replies visibility for each comment
        const initialRepliesVisibility = commentsData.reduce((acc, comment) => {
          acc[comment.series_comments_id] = comment.replies.slice(0, 2); // Only show the first 2 replies initially
          return acc;
        }, {});
  
        setComments(commentsData);
        setRepliesVisibility(initialRepliesVisibility);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setComments([]);
      }
    }
    fetchComments();
  }, [contentId]);
  


  const handleShowMoreComments = () => {
    setVisibleComments(prevVisibleComments => prevVisibleComments + 5); 
  };

  const postNewComment = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/api/comments/newComment/`, {
        content_id: contentId,
        table_name: 'series',
        comment: newComment,
      },
      { withCredentials: true });
      console.log(res.data);
      setNewComment(''); // Reset the input field after posting
    }
    catch(err) {
      console.error(err + ': Error posting new comment');
    }
  };
  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId === replyToCommentId ? null : commentId);
  };
  const postReply = async (parentCommentId) => {
    try {
      const res = await axios.post(`http://localhost:3001/api/comments/newReply`, {
        parent_comment_id: parseInt(parentCommentId),
        comment: newComment,
        table: 'series',
        parent_content_id: parseInt(contentId),
      }, { withCredentials: true });
      console.log(res.data);
      setNewComment(''); // Clear the input field after posting
      setReplyToCommentId(null); // Reset the reply target ID
      fetchComments(); // Refresh comments to show the new reply
    } catch (err) {
      console.error(err + ': Error posting new reply');
    }
  };
  


  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleRating = async (commentId, voteType) => {
    const ratingType = voteType === '+' ? 'up' : 'down'; 
    try {
        const response = await axios.post(`http://localhost:3001/api/user/rating/${ratingType}`, {
            comment_id: commentId,
            table: 'series' 
        }, { withCredentials: true });

        if (response.status === 200) {
            console.log('Rating updated successfully');
        }
    } catch (error) {
        console.error('Failed to update rating:', error);
    }
};



  return (
    <div className={`${styles.discussionTabContainer}`}>
      <div className={styles.newCommentForm}>
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
        comments.slice(0, visibleComments).map((comment) => (
          <div key={comment.series_comments_id} className={styles.commentContainer}>
            <div className={styles.voteAndCommentContainer}>
              <div className={styles.voteButtonsContainer}>
                <button
                  className={styles.voteButton}
                  onClick={() => handleRating(comment.series_comments_id, '+')}
                >
                  +
                </button>
                <span className={styles.voteCount}>
                  {comment.series_comments_upvotes - comment.series_comments_downvotes}
                </span>
                <button
                  className={styles.voteButton}
                  onClick={() => handleRating(comment.series_comments_id, '-')}
                >
                  -
                </button>
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
              <div className={styles.repliesContainer}>
                {comment.replies.map((reply) => (
                  <div key={reply.series_comments_id} className={styles.commentContainer} style={{ marginLeft: '20px' }}>
                    <div className={styles.voteAndCommentContainer}>
                      <div className={styles.voteButtonsContainer}>
                        <button
                          className={styles.voteButton}
                          onClick={() => handleRating(reply.series_comments_id, 1)}
                        >
                          +
                        </button>
                        <span className={styles.voteCount}>
                          {reply.series_comments_upvotes - reply.series_comments_downvotes}
                        </span>
                        <button
                          className={styles.voteButton}
                          onClick={() => handleRating(reply.series_comments_id, -1)}
                        >
                          -
                        </button>
                      </div>

                      <div className={styles.commentAndFooterContainer}>
                        <div className={styles.commentHeader}>
                          <div className={styles.headerContainer}>
                            <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
                            <span className={styles.commentAuthor}>{reply.user.user_nickname}</span>
                          </div>
                          <p className={styles.commentDate}>{formatDate(reply.date_created)}</p>
                        </div>
                        <p className={styles.commentContent}>{reply.series_comments_content}</p>
                        <div className={styles.commentFooter}>
                          <span className={styles.replyButton} onClick={() => handleReplyClick(reply.series_comments_id)}>
                            <FontAwesomeIcon icon={faReply} /> Reply
                          </span>
                        </div>
                      </div>
                    </div>
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
                <button className={styles.newCommentButton} onClick={() => postReply(replyToCommentId)}>
                  Send
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className={styles.noComments}>No comments yet.</p>
      )}
      {comments.length > visibleComments && (
        <button 
          className={styles.loadMoreButton} 
          onClick={() => setVisibleComments(visibleComments + 5)}>
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default CommentsSection;