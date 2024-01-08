const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController.js')

router.route('/add').post(watchlistController.addToWatchlist)

module.exports = router;