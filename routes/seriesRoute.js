const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController.js')

router.route('/summary').get(seriesController.getSummary)
router.route('/specific/:seriesID').get(seriesController.getSpecificSeries)


module.exports = router;