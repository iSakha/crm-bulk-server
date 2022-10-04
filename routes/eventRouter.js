const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();

router.get('/', eventController.getAll);
router.get('/event/:id', eventController.getOne);
router.post('/', eventController.create);


router.post('/trans', eventController.createTrans);

module.exports = router;