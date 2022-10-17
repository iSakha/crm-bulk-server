const express = require('express');
const dayDetailsController = require('../controllers/dayDetailsController');
const router = express.Router();

router.get('/', dayDetailsController.getDayDetails);

module.exports = router;