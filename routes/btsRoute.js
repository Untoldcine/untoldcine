const express = require('express');
const router = express.Router();
const btsController = require('../controllers/btsController.js')

router.route('/summaryBTSSeries').get(btsController.getSummaryBTSSeries)
router.route('/summaryBTSMovies').get(btsController.getSummaryBTSMovies)
router.route('/summaryBTSAll').get(btsController.getSummaryBTSAll)
router.route('/specificBTS/:seriesID').get(btsController.getSpecificBTS)

module.exports = router;