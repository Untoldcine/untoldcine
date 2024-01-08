const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController.js')

router.route('/getDiscussion/:seriesID').get(commentsController.getSeriesComments)
router.route('/getPodcastDiscussion/:podcastID').get(commentsController.getPodcastComments)

module.exports = router;