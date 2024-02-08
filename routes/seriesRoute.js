const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController.js')

router.route('/seriesSummary').get(seriesController.getSeriesSummary)
router.route('/specific/:seriesID').get(seriesController.getSpecificSeries)

module.exports = router;