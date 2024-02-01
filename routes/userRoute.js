const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js')

router.route('/new').post(userController.createNewUser)
router.route('/login').post(userController.logIn)
router.route('/rating/:choice').post(userController.submitRating)
router.route('/delete/:userID').post(userController.removeUser)

router.route('/testPrisma').get(userController.testPrisma)

module.exports = router;