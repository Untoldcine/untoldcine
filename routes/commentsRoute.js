const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController.js')

router.route('/getDiscussion/:seriesID').get(commentsController.getSeriesComments)
router.route('/getPodcastDiscussion/:podcastID').get(commentsController.getPodcastComments)
router.route('/getBTSDiscussion/:seriesID').get(commentsController.getBTSComments)
router.route('/newComment/:userID').post(commentsController.newComment)
router.route('/editComment').post(commentsController.editComment)
router.route('/newReply/:userID').post(commentsController.replyComment)
router.route('/removeComment/:userID').post(commentsController.removeComment)

module.exports = router;