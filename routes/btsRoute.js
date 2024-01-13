const express = require('express');
const router = express.Router();
const btsController = require('../controllers/btsController.js')

router.route('/summaryBTS').get(btsController.getSummaryBTS)
router.route('/specificBTS/:seriesID').get(btsController.getSpecificBTS)

module.exports = router;