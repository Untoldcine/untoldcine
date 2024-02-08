const express = require('express');
const router = express.Router();
const btsController = require('../controllers/btsController.js')

router.route('/summaryBTSSeries').get(btsController.getSummaryBTSSeries)
router.route('/summaryBTSMovies').get(btsController.getSummaryBTSMovies)
router.route('/summaryBTSAll').get(btsController.getSummaryBTSAll)
router.route('/specificSeries/:bts_series_id').get(btsController.getSpecificSeriesBTS)
router.route('/specificMovies/:bts_movies_id').get(btsController.getSpecificMoviesBTS)

module.exports = router;