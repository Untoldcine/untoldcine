const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController.js')

router.route('/movieSummary').get(seriesController.getMovieSummary)
router.route('/specific/:movieID').get(seriesController.getSpecificMovies)


module.exports = router;