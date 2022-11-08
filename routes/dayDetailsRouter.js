const express = require('express');
const dayDetailsController = require('../controllers/dayDetailsController');
const router = express.Router();

router.get('/', dayDetailsController.getDayDetails);
router.get('/gant', dayDetailsController.getDayDetailsGant);

module.exports = router;