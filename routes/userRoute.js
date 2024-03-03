const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

router.route('/new').post(userController.createNewUser)
router.route('/login').post(userController.logIn)
router.route('/rating/:choice').post(userController.submitCommentRating)
router.route('/mediaRating/:choice').post(userController.submitMediaRating)
router.route('/delete/:userID').post(userController.removeUser)

router.route('/adminLogin').post(adminController.adminLogIn)
router.route('/adminGetAll').get(adminController.adminGetAll)
router.route('/adminUpdate/:table').post(adminController.adminUpdate)
router.route('/adminDelete/:table/:id').post(adminController.adminDelete)
router.route('/adminAdd').post(adminController.adminAdd)
router.route('/getUploadSignedURL/:content_name/:content_type/:asset').get(adminController.getSignedUrl)

module.exports = router;