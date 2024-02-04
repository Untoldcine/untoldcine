const express = require('express');
const router = express.Router();
const podcastsController = require('../controllers/podcastsController.js')

router.route('/podcastSummary').get(podcastsController.getPodcastSummary)
router.route('/specific/:podcastID').get(podcastsController.getSpecificPodcast)

module.exports = router;