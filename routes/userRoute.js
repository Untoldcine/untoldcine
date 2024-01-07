const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js')

router.route('/new').post(userController.createNewUser)
router.route('/delete/:userID').post(userController.removeUser)

module.exports = router;