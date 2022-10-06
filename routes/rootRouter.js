const express = require('express');
const rootController = require('../controllers/rootController');
const router = express.Router();


router.get('/', rootController.greetMessage);
router.get('/checkdb', rootController.checkDbConnection);
router.get('/warehouses', rootController.getWarehouses);
router.get('/status', rootController.getStatus);
router.get('/phase', rootController.getPhases);



module.exports = router;