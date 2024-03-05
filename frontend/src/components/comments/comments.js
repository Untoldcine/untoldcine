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
  const [userVotes, setUserVotes] = useState({});
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/comments/${commentId}`, {
        data: {
          comment_id: commentId,
          table: 'series' 
        },
        withCredentials: true
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  

  const handleLoadMoreReplies = (commentId) => {
    const currentReplies = repliesVisibility[commentId] || [];
    const offset = currentReplies.length;
    const limit = 2; 

    axios.get(`http://localhost:3001/api/series/replies`, {
      params: { commentId, offset, limit }
    })
    .then(response => {
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
        
        const initialRepliesVisibility = commentsData.reduce((acc, comment) => {
          acc[comment.series_comments_id] = comment.replies.slice(0, 2); 
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
      setNewComment(''); 
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
      setNewComment(''); 
      setReplyToCommentId(null);
      fetchComments(); 
    } catch (err) {
      console.error(err + ': Error posting new reply');
    }
  };
  


  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

//   const handleRating = async (commentId, voteType) => {
//     const ratingType = voteType === '+' ? 'up' : 'down'; 
//     try {
//         const response = await axios.post(`http://localhost:3001/api/user/rating/${ratingType}`, {
//             comment_id: commentId,
//             table: 'series' 
//         }, { withCredentials: true });

//         if (response.status === 200) {
//             console.log('Rating updated successfully');
//         }
//     } catch (error) {
//         console.error('Failed to update rating:', error);
//     }
// };

// const handleRating = async (commentId, voteType) => {
//   // Optimistically update the UI
//   setComments(currentComments => currentComments.map(comment => {
//     if (comment.series_comments_id === commentId) {
//       if (voteType === '+') {
//         // Increment upvotes for the specific comment
//         return { ...comment, series_comments_upvotes: comment.series_comments_upvotes + 1 };
//       } else if (voteType === '-') {
//         // Increment downvotes for the specific comment
//         return { ...comment, series_comments_downvotes: comment.series_comments_downvotes + 1 };
//       }
//     }
//     return comment;
//   }));

//   try {
//     const response = await axios.post(`http://localhost:3001/api/user/rating/${voteType}`, {
//       comment_id: commentId,
//       table: 'series'
//     }, { withCredentials: true });

//     if (response.status === 200) {
//       console.log('Rating updated successfully');
//       // Optionally, refresh the comments from the server to ensure data consistency
//     }
//   } catch (error) {
//     console.error('Failed to update rating:', error);
//     // Optionally, revert the optimistic UI update here
//   }
// };

// const handleRating = async (commentId, voteType) => {
//   const currentVote = userVotes[commentId];
//   const isVoteChange = currentVote && currentVote !== voteType;
//   const isTogglingOff = currentVote === voteType;

//   const updatedUserVotes = { ...userVotes };
//   if (isTogglingOff || isVoteChange) {
//     updatedUserVotes[commentId] = isVoteChange ? voteType : null;
//   } else if (!currentVote) {
//     updatedUserVotes[commentId] = voteType;
//   }
//   setUserVotes(updatedUserVotes);

//   setComments(comments.map(comment => {
//     if (comment.series_comments_id === commentId) {
//       let updatedComment = { ...comment };
//       if (isVoteChange || !currentVote) {
//         updatedComment.series_comments_upvotes += voteType === '+' ? 1 : 0;
//         updatedComment.series_comments_downvotes += voteType === '-' ? 1 : 0;

//         if (isVoteChange) {
//           updatedComment.series_comments_upvotes -= currentVote === '+' ? 1 : 0;
//           updatedComment.series_comments_downvotes -= currentVote === '-' ? 1 : 0;
//         }
//       } else if (isTogglingOff) {
//         updatedComment.series_comments_upvotes -= voteType === '+' ? 1 : 0;
//         updatedComment.series_comments_downvotes -= voteType === '-' ? 1 : 0;
//       }
//       return updatedComment;
//     }
//     return comment;
//   }));

//   if (!isTogglingOff || isVoteChange) {
//     try {
//       await axios.post(`http://localhost:3001/api/user/rating/${voteType}`, {
//         comment_id: commentId,
//         vote: updatedUserVotes[commentId], 
//         table: 'series',
//       }, { withCredentials: true });
//     } catch (error) {
//       console.error('Failed to update rating:', error);
//     }
//   }
// };

const handleRating = async (commentId, voteType) => {
  const currentVote = userVotes[commentId];
  const isVoteChange = currentVote && currentVote !== voteType;
  const isTogglingOff = currentVote === voteType;

  // Update the userVotes state based on the action
  const updatedUserVotes = { ...userVotes, [commentId]: isTogglingOff ? null : voteType };
  setUserVotes(updatedUserVotes);

  // Update the comments state to reflect the new vote
  setComments(comments.map(comment => {
    if (comment.series_comments_id === commentId) {
      let upvotesChange = 0;
      let downvotesChange = 0;
      
      if (voteType === 'up') {
        if (isTogglingOff) {
          upvotesChange = -1;
        } else if (isVoteChange) {
          upvotesChange = 1;
          downvotesChange = -1;
        } else if (!currentVote) {
          upvotesChange = 1;
        }
      } else if (voteType === 'down') {
        if (isTogglingOff) {
          downvotesChange = -1;
        } else if (isVoteChange) {
          downvotesChange = 1;
          upvotesChange = -1;
        } else if (!currentVote) {
          downvotesChange = 1;
        }
      }

      return {
        ...comment,
        series_comments_upvotes: comment.series_comments_upvotes + upvotesChange,
        series_comments_downvotes: comment.series_comments_downvotes + downvotesChange,
      };
    }
    return comment;
  }));

  // Attempt to post the vote update to the server
  try {
    await axios.post(`http://localhost:3001/api/user/rating/${voteType}`, {
      comment_id: commentId,
      vote: updatedUserVotes[commentId], 
      table: 'series',
    }, { withCredentials: true });
  } catch (error) {
    console.error('Failed to update rating:', error);
    // Revert the optimistic update in case of error
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
                  onClick={() => handleRating(comment.series_comments_id, 'up')}
                >
                  + 
                </button>
                <span className={styles.voteCount}>
                  {comment.series_comments_upvotes - comment.series_comments_downvotes}
                </span>
                <button
                  className={styles.voteButton}
                  onClick={() => handleRating(comment.series_comments_id, 'down')}
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
                  <button className={styles.deleteButton} onClick={() => handleDeleteComment(comment.series_comments_id)}>
                    Delete
                  </button>
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