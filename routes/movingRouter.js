const express = require('express');
const movingController = require('../controllers/movingController');
const router = express.Router();

router.get('/', movingController.getAll);
router.post('/', movingController.create);
router.get('/:id', movingController.getOne);
router.put('/:id', movingController.update);
router.delete('/:id', movingController.delete);
router.get('/status/all', movingController.getStatus);

module.exports = router;