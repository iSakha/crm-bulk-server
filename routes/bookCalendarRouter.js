const express = require('express');
const bookCalendarController = require('../controllers/bookCalendarController');
const router = express.Router();

router.get('/all', bookCalendarController.getAll);
router.get('/', bookCalendarController.getModelsByCatWhPeriod);
router.get('/search', bookCalendarController.searchModelByWhPeriod);
// /booking/?deps=001&cats=001&whid=all&start=2022-09-01T00:00:00.000Z&end=2022-09-30T00:00:00.000Z


module.exports = router;