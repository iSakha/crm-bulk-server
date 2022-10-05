const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();

router.get('/', eventController.getAll);
router.get('/event/:id', eventController.getOne);
router.post('/', eventController.createTrans);
router.delete('/:id', eventController.deleteTrans);
router.put('/:id', eventController.updateTrans);

module.exports = router;