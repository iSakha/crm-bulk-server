const express = require('express');
const notificateController = require('../controllers/notificateController');
const router = express.Router();

router.get('/', notificateController.getAll);
router.get('/wh', notificateController.getByWarehouse);

router.post('/', notificateController.createNew);

module.exports = router;