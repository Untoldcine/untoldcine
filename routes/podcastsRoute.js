const express = require('express');
const router = express.Router();
const podcastsController = require('../controllers/podcastsController.js')

router.route('/summary').get(podcastsController.getSummary)
router.route('/summary/relatedContent/:podcastID').get(podcastsController.getRelatedContent)
router.route('/specific/:podcastID').get(podcastsController.getSpecificPodcast)

module.exports = router;