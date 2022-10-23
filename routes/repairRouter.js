const express = require('express');
const repairtroller = require('../controllers/repairController');
const router = express.Router();

router.get('/', repairtroller.getAll);
router.get('/model', repairtroller.getModel);
router.post('/', repairtroller.create);

module.exports = router;