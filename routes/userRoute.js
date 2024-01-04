const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js')

router.route('/').get(userController.getAllUsers)

module.exports = router;