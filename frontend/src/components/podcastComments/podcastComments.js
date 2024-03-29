'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from '../comments/comments.module.css'; 

const PodcastCommentsSection = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [visibleComments, setVisibleComments] = useState(5); 
  const [newReply, setNewReply] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/podcast/comments/${contentId}`);
      setComments(response.data); // Assuming the response directly contains the array of comments
      console.log("Comments fetched successfully:", response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [contentId]);

  // const handleShowMoreComments = () => {
  //   setVisibleComments(prevVisibleComments => prevVisibleComments + 5); 
  // };

  const postNewComment = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/api/comments/newComment/`, {
        content_id: contentId,
        table_name: 'podcast',
        comment: newComment, 
      }, { withCredentials: true });

      if (response.status === 200) {
        console.log('Comment posted successfully.');
        setNewComment(''); 
        fetchComments();
      } else {
        console.error('Failed to post new comment:', response.data);
      }
    } catch (err) {
      console.error('Error posting new comment:', err);
    }
  };



  const postReply = async (parentCommentId) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/comments/newReply`, {
        parent_comment_id: parseInt(parentCommentId),
        comment: newReply, // Use newReply here
        table: 'podcast',
        parent_content_id: parseInt(contentId),
      }, { withCredentials: true });
  
      console.log(response.data);
      setNewReply(''); // Reset the newReply field correctly
      setReplyToCommentId(null); // Reset any reply-to-comment state as necessary
  
      fetchComments(); // Refetch comments to update the UI with the new reply
    } catch (err) {
      console.error('Error posting new reply:', err);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId === replyToCommentId ? null : commentId); 
  };
  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  const handleShowMoreComments = () => {
    setVisibleComments(prevVisibleComments => prevVisibleComments + 5); 
  };
  const handleRating = async (commentId, voteType) => {
    const ratingType = voteType === '+' ? 'up' : 'down'; 
    try {
        const response = await axios.post(`http://localhost:3001/api/user/rating/${ratingType}`, {
            comment_id: commentId,
            table: 'podcast' 
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
        <div key={comment.podcast_comments_id} className={styles.commentContainer}>
          <div className={styles.voteAndCommentContainer}>
            <div className={styles.voteButtonsContainer}>
            <button
                        className={styles.voteButton}
                        onClick={() => handleRating(comment.podcast_comments_id, '+')}
                    >
                        +
                    </button>
                    <span className={styles.voteCount}>
                        {comment.podcast_comments_upvotes - comment.podcast_comments_downvotes}
                    </span>
                    <button
                        className={styles.voteButton}
                        onClick={() => handleRating(comment.podcast_comments_id, '-')}
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
              <p className={styles.commentContent}>{comment.podcast_comments_content}</p>
              <div className={styles.commentFooter}>
                <span className={styles.replyButton} onClick={() => handleReplyClick(comment.podcast_comments_id)}>
                  <FontAwesomeIcon icon={faReply} /> Reply
                </span>
              </div>
            </div>
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className={styles.repliesContainer}>
              {comment.replies.map((reply) => (
                <div key={reply.podcast_comments_id} className={styles.commentContainer} style={{marginLeft: '20px'}}>
                  <div className={styles.voteAndCommentContainer}>
                    <div className={styles.voteButtonsContainer}>
                    <button
                className={styles.voteButton}
                onClick={() => handleRating(reply.podcast_comments_id, '+')}
            >
                +
            </button>
            <span className={styles.voteCount}>
                {reply.podcast_comments_upvotes - reply.podcast_comments_downvotes}
            </span>
            <button
                className={styles.voteButton}
                onClick={() => handleRating(reply.podcast_comments_id, '-')}
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
                      <p className={styles.commentContent}>{reply.podcast_comments_content}</p>
                      <div className={styles.commentFooter}>
                      <button
  className={styles.replyButton}
  onClick={() => {
    console.log(`Replying to comment ID: ${reply.podcast_comments_id}`);
    setReplyToCommentId(reply.podcast_comments_id);
  }}>
  <FontAwesomeIcon icon={faReply} /> Reply
</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {replyToCommentId === comment.podcast_comments_id && (
            <div className={`${styles.replyInputContainer} ${styles.replyToComment}`}>
              <input
  className={styles.newCommentTextarea}
  value={newReply}
  onChange={(e) => setNewReply(e.target.value)}
  placeholder="Write a reply..."
/>
              <button className={styles.newCommentButton} onClick={() => postReply(comment.podcast_comments_id)}>
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

export default PodcastCommentsSection;
