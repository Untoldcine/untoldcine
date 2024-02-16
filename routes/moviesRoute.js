const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController.js')
const commentsController = require('../controllers/commentsController.js')

router.route('/movieSummary').get(seriesController.getMovieSummary)
router.route('/specific/:movieID').get(seriesController.getSpecificMovies)
router.route('/comments/:movieID').get(commentsController.getMovieComments)


module.exports = router;