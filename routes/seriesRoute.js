const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController.js')

router.route('/summary').get(seriesController.getSummary)
router.route('/specific/:seriesID').get(seriesController.getSpecificSeries)
router.route('/rating/:userID/:contentID/:choice').post(seriesController.submitRating)


module.exports = router;