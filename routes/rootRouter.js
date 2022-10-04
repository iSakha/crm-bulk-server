const express = require('express');
const rootController = require('../controllers/rootController');
const router = express.Router();


router.get('/', rootController.greetMessage);
router.get('/checkdb', rootController.checkDbConnection);
router.get('/warehouses', rootController.getWarehouses);




module.exports = router;