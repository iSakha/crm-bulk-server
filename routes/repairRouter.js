const express = require('express');
const repairtroller = require('../controllers/repairController');
const router = express.Router();

router.get('/', repairtroller.getAll);

module.exports = router;