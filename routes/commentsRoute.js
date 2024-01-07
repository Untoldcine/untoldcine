const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController.js')

router.route('/getDiscussion/:seriesID').get(commentsController.getSeriesComments)

module.exports = router;