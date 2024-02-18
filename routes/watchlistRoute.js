const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController.js')

router.route('/add').post(watchlistController.addToWatchlist)
router.route('/getList').get(watchlistController.getWatchlist)

module.exports = router;