const express = require('express');
const router = express.Router();
const podcastsController = require('../controllers/podcastsController.js')
const commentsController = require('../controllers/commentsController.js')

router.route('/podcastSummary').get(podcastsController.getPodcastSummary)
router.route('/specific/:podcastID').get(podcastsController.getSpecificPodcast)
router.route('/comments/:userID/:podcastID').get(commentsController.getPodcastComments)


module.exports = router;