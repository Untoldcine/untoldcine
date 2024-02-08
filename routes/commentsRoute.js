const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController.js')

// router.route('/getDiscussion/:userID/:seriesID').get(commentsController.getSeriesComments)
// router.route('/getPodcastDiscussion/:userID/:podcastID').get(commentsController.getPodcastComments)
router.route('/getBTSDiscussion/:userID/:seriesID').get(commentsController.getBTSComments)
router.route('/newComment/:userID').post(commentsController.newComment)
router.route('/editComment').post(commentsController.editComment)
router.route('/newReply/:userID').post(commentsController.replyComment)
router.route('/newPodcastReply/:userID').post(commentsController.replyPodcastComment)
router.route('/newBTSReply/:userID').post(commentsController.replyBTSComment)
router.route('/removeComment/:userID').post(commentsController.removeComment)

module.exports = router;