const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js')

router.route('/new').post(userController.createNewUser)
router.route('/login').post(userController.logIn)
router.route('/rating/:choice').post(userController.submitCommentRating)
router.route('/mediaRating/:choice').post(userController.submitMediaRating)
router.route('/delete/:userID').post(userController.removeUser)

router.route('/adminLogin').post(userController.adminLogIn)
router.route('/adminGetAll').get(userController.adminGetAll)
router.route('/adminUpdate/:table').post(userController.adminUpdate)
router.route('/adminDelete/:table/:id').post(userController.adminDelete)
router.route('/adminAdd').post(userController.adminAdd)

module.exports = router;