const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController.js')
const commentsController = require('../controllers/commentsController.js')

router.route('/seriesSummary').get(seriesController.getSeriesSummary)
router.route('/specific/:seriesID').get(seriesController.getSpecificSeries)
router.route('/comments/:userID/:seriesID').get(commentsController.getSeriesComments)


module.exports = router;