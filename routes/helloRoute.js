const express = require("express");
const router = express.Router();
const controllers = require('../controllers/helloController.js');
router.get('/', controllers.getHello)
module.exports = router;
